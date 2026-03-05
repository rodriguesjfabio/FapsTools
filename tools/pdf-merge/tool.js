let selectedFiles = [];
let fileOrder = [];

function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  addFiles(files);
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

  const files = Array.from(event.dataTransfer.files).filter(file =>
    file.type === 'application/pdf'
  );

  addFiles(files);
}

function addFiles(files) {
  files.forEach(file => {
    if (file.type === 'application/pdf' && !selectedFiles.some(f => f.name === file.name)) {
      selectedFiles.push(file);
      fileOrder.push(file.name);
    }
  });

  updateFileList();
  updateMergeButton();
}

function removeFile(fileName) {
  selectedFiles = selectedFiles.filter(file => file.name !== fileName);
  fileOrder = fileOrder.filter(name => name !== fileName);
  updateFileList();
  updateMergeButton();
}

function moveFileUp(index) {
  if (index > 0) {
    [fileOrder[index], fileOrder[index - 1]] = [fileOrder[index - 1], fileOrder[index]];
    updateFileList();
  }
}

function moveFileDown(index) {
  if (index < fileOrder.length - 1) {
    [fileOrder[index], fileOrder[index + 1]] = [fileOrder[index + 1], fileOrder[index]];
    updateFileList();
  }
}

function updateFileList() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '';

  if (fileOrder.length === 0) {
    fileList.innerHTML = '<p class="no-files">No PDF files selected</p>';
    return;
  }

  fileOrder.forEach((fileName, index) => {
    const file = selectedFiles.find(f => f.name === fileName);
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';

    fileItem.innerHTML = `
      <div class="file-info">
        <span class="file-name">${file.name}</span>
        <span class="file-size">${formatFileSize(file.size)}</span>
      </div>
      <div class="file-actions">
        <button onclick="moveFileUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button onclick="moveFileDown(${index})" ${index === fileOrder.length - 1 ? 'disabled' : ''}>↓</button>
        <button onclick="removeFile('${file.name}')" class="remove-btn">✕</button>
      </div>
    `;

    fileList.appendChild(fileItem);
  });
}

function updateMergeButton() {
  const mergeBtn = document.getElementById('merge-btn');
  mergeBtn.disabled = selectedFiles.length < 2;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function mergePDFs() {
  if (selectedFiles.length < 2) return;

  const mergeBtn = document.getElementById('merge-btn');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  mergeBtn.disabled = true;
  mergeBtn.textContent = 'Merging...';
  progressContainer.style.display = 'block';

  try {
    // Create a new PDF document
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let i = 0; i < fileOrder.length; i++) {
      const fileName = fileOrder[i];
      const file = selectedFiles.find(f => f.name === fileName);

      progressText.textContent = `Processing ${file.name}...`;
      progressFill.style.width = `${((i + 1) / fileOrder.length) * 100}%`;

      // Load the PDF file
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFLib.PDFDocument.load(fileBuffer);

      // Copy all pages from the current PDF to the merged PDF
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach(page => mergedPdf.addPage(page));
    }

    progressText.textContent = 'Finalizing...';

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Create download link
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    progressText.textContent = 'Download complete!';
    setTimeout(() => {
      progressContainer.style.display = 'none';
    }, 2000);

  } catch (error) {
    console.error('Error merging PDFs:', error);
    alert('Error merging PDFs. Please try again.');
    progressContainer.style.display = 'none';
  } finally {
    mergeBtn.disabled = false;
    mergeBtn.textContent = 'Merge PDFs';
  }
}

function clearAll() {
  selectedFiles = [];
  fileOrder = [];
  document.getElementById('pdf-files').value = '';
  updateFileList();
  updateMergeButton();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('pdf-files');
  const uploadArea = document.querySelector('.pdf-upload-area');
  const mergeBtn = document.getElementById('merge-btn');
  const clearBtn = document.getElementById('clear-btn');

  fileInput.addEventListener('change', handleFileSelect);
  uploadArea.addEventListener('dragover', handleDragOver);
  uploadArea.addEventListener('dragleave', handleDragLeave);
  uploadArea.addEventListener('drop', handleDrop);
  mergeBtn.addEventListener('click', mergePDFs);
  clearBtn.addEventListener('click', clearAll);
});