let selectedFile = null;
let pdfDoc = null;
let totalPages = 0;

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    loadPDF(file);
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  const files = Array.from(event.dataTransfer.files);
  const pdfFile = files.find(file => file.type === 'application/pdf');

  if (pdfFile) {
    loadPDF(pdfFile);
  }
}

async function loadPDF(file) {
  selectedFile = file;
  const progressText = document.getElementById('progress-text');
  const progressContainer = document.getElementById('progress-container');

  progressContainer.style.display = 'block';
  progressText.textContent = 'Loading PDF...';

  try {
    const fileBuffer = await file.arrayBuffer();
    pdfDoc = await PDFLib.PDFDocument.load(fileBuffer);
    totalPages = pdfDoc.getPageCount();

    updatePDFInfo();
    showSplitOptions();

    progressContainer.style.display = 'none';
  } catch (error) {
    console.error('Error loading PDF:', error);
    alert('Error loading PDF. Please try again.');
    progressContainer.style.display = 'none';
  }
}

function updatePDFInfo() {
  const pdfInfo = document.getElementById('pdf-info');
  const pdfDetails = document.getElementById('pdf-details');

  pdfDetails.textContent = `File: ${selectedFile.name} | Pages: ${totalPages}`;
  pdfInfo.style.display = 'block';

  // Update split page input max
  document.getElementById('split-page').max = totalPages;
}

function showSplitOptions() {
  const splitOptions = document.getElementById('split-options');
  const splitBtn = document.getElementById('split-btn');

  splitOptions.style.display = 'block';
  splitBtn.disabled = false;
}

function parsePageRanges(rangesText) {
  const ranges = [];
  const parts = rangesText.split(',').map(part => part.trim());

  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(num => parseInt(num.trim()));
      if (start && end && start <= end && start >= 1 && end <= totalPages) {
        ranges.push({ start: start - 1, end: end - 1 }); // Convert to 0-based
      }
    } else {
      const page = parseInt(part);
      if (page && page >= 1 && page <= totalPages) {
        ranges.push({ start: page - 1, end: page - 1 }); // Convert to 0-based
      }
    }
  }

  return ranges;
}

async function splitPDF() {
  if (!pdfDoc || !selectedFile) return;

  const splitBtn = document.getElementById('split-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  splitBtn.disabled = true;
  progressContainer.style.display = 'block';
  progressFill.style.width = '0%';

  try {
    const splitMode = document.querySelector('input[name="split-mode"]:checked').value;
    let splitResults = [];

    if (splitMode === 'single') {
      const splitPage = parseInt(document.getElementById('split-page').value) - 1; // 0-based

      progressText.textContent = 'Splitting PDF...';

      // First part: pages 0 to splitPage
      if (splitPage >= 0) {
        const part1 = await PDFLib.PDFDocument.create();
        const pages1 = await part1.copyPages(pdfDoc, Array.from({length: splitPage + 1}, (_, i) => i));
        pages1.forEach(page => part1.addPage(page));
        splitResults.push({
          name: `${getFileNameWithoutExtension(selectedFile.name)}_part1.pdf`,
          pdf: part1
        });
      }

      // Second part: pages splitPage+1 to end
      if (splitPage + 1 < totalPages) {
        const part2 = await PDFLib.PDFDocument.create();
        const pages2 = await part2.copyPages(pdfDoc, Array.from({length: totalPages - splitPage - 1}, (_, i) => i + splitPage + 1));
        pages2.forEach(page => part2.addPage(page));
        splitResults.push({
          name: `${getFileNameWithoutExtension(selectedFile.name)}_part2.pdf`,
          pdf: part2
        });
      }

    } else if (splitMode === 'range') {
      const rangesText = document.getElementById('page-ranges').value;
      const ranges = parsePageRanges(rangesText);

      if (ranges.length === 0) {
        alert('Please enter valid page ranges');
        return;
      }

      progressText.textContent = 'Splitting PDF into ranges...';

      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const part = await PDFLib.PDFDocument.create();
        const pages = await part.copyPages(pdfDoc, Array.from({length: range.end - range.start + 1}, (_, j) => j + range.start));
        pages.forEach(page => part.addPage(page));

        splitResults.push({
          name: `${getFileNameWithoutExtension(selectedFile.name)}_pages_${range.start + 1}-${range.end + 1}.pdf`,
          pdf: part
        });

        progressFill.style.width = `${((i + 1) / ranges.length) * 100}%`;
      }

    } else if (splitMode === 'individual') {
      progressText.textContent = 'Splitting into individual pages...';

      for (let i = 0; i < totalPages; i++) {
        const part = await PDFLib.PDFDocument.create();
        const [page] = await part.copyPages(pdfDoc, [i]);
        part.addPage(page);

        splitResults.push({
          name: `${getFileNameWithoutExtension(selectedFile.name)}_page_${i + 1}.pdf`,
          pdf: part
        });

        progressFill.style.width = `${((i + 1) / totalPages) * 100}%`;
      }
    }

    progressText.textContent = 'Preparing downloads...';
    await createDownloadLinks(splitResults);

    progressContainer.style.display = 'none';

  } catch (error) {
    console.error('Error splitting PDF:', error);
    alert('Error splitting PDF. Please try again.');
    progressContainer.style.display = 'none';
  } finally {
    splitBtn.disabled = false;
  }
}

async function createDownloadLinks(splitResults) {
  const downloadLinks = document.getElementById('download-links');
  const downloadList = document.getElementById('download-list');

  downloadList.innerHTML = '';

  for (const result of splitResults) {
    const pdfBytes = await result.pdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const linkItem = document.createElement('div');
    linkItem.className = 'download-item';

    linkItem.innerHTML = `
      <span>${result.name}</span>
      <a href="${url}" download="${result.name}" class="download-btn">Download</a>
    `;

    downloadList.appendChild(linkItem);

    // Store blob for ZIP creation
    result.blob = blob;
    result.url = url;
  }

  downloadLinks.style.display = 'block';
}

async function downloadAllAsZip() {
  const downloadList = document.getElementById('download-links');
  const items = downloadList.querySelectorAll('.download-item');

  if (items.length === 0) return;

  const zip = new JSZip();
  const baseName = getFileNameWithoutExtension(selectedFile.name);

  for (let i = 0; i < items.length; i++) {
    const link = items[i].querySelector('a');
    const fileName = link.download;
    const url = link.href;

    // Fetch the blob from the URL
    const response = await fetch(url);
    const blob = await response.blob();

    zip.file(fileName, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const zipUrl = URL.createObjectURL(zipBlob);

  const a = document.createElement('a');
  a.href = zipUrl;
  a.download = `${baseName}_split.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(zipUrl);
}

function getFileNameWithoutExtension(fileName) {
  return fileName.replace(/\.[^/.]+$/, '');
}

function clearAll() {
  selectedFile = null;
  pdfDoc = null;
  totalPages = 0;

  document.getElementById('pdf-file').value = '';
  document.getElementById('pdf-info').style.display = 'none';
  document.getElementById('split-options').style.display = 'none';
  document.getElementById('download-links').style.display = 'none';
  document.getElementById('split-btn').disabled = true;
  document.getElementById('progress-container').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('pdf-file');
  const uploadArea = document.querySelector('.pdf-upload-area');
  const splitBtn = document.getElementById('split-btn');
  const clearBtn = document.getElementById('clear-btn');
  const downloadAllBtn = document.getElementById('download-all-btn');

  fileInput.addEventListener('change', handleFileSelect);
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);
  splitBtn.addEventListener('click', splitPDF);
  clearBtn.addEventListener('click', clearAll);
  downloadAllBtn.addEventListener('click', downloadAllAsZip);

  // Update split page input when mode changes
  document.querySelectorAll('input[name="split-mode"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const splitPageInput = document.getElementById('split-page');
      const pageRangesInput = document.getElementById('page-ranges');

      if (radio.value === 'single') {
        splitPageInput.disabled = false;
        pageRangesInput.disabled = true;
      } else if (radio.value === 'range') {
        splitPageInput.disabled = true;
        pageRangesInput.disabled = false;
      } else {
        splitPageInput.disabled = true;
        pageRangesInput.disabled = true;
      }
    });
  });
});