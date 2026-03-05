let inputTextarea = null;
let outputTextarea = null;
let inputCharCount = null;

async function generateSHA1() {
  const input = inputTextarea.value;

  if (!input.trim()) {
    outputTextarea.value = "";
    return;
  }

  try {
    const hash = await sha1(input);
    outputTextarea.value = hash;
    showSuccess("SHA-1 hash generated!");
  } catch (err) {
    outputTextarea.value = "Error generating SHA-1 hash";
    showError("Failed to generate SHA-1 hash");
  }
}

async function generateSHA256() {
  const input = inputTextarea.value;

  if (!input.trim()) {
    outputTextarea.value = "";
    return;
  }

  try {
    const hash = await sha256(input);
    outputTextarea.value = hash;
    showSuccess("SHA-256 hash generated!");
  } catch (err) {
    outputTextarea.value = "Error generating SHA-256 hash";
    showError("Failed to generate SHA-256 hash");
  }
}

async function sha1(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function copyToClipboard() {
  const output = outputTextarea.value;

  if (!output.trim()) {
    showError("Nothing to copy!");
    return;
  }

  navigator.clipboard.writeText(output).then(() => {
    showSuccess("Hash copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showError("Failed to copy to clipboard");
  });
}

function clearInput() {
  inputTextarea.value = "";
  updateCharCount();
  outputTextarea.value = "";
  inputTextarea.focus();
}

function clearOutput() {
  outputTextarea.value = "";
}

function updateCharCount() {
  const text = inputTextarea.value;
  inputCharCount.textContent = `${text.length} character${text.length !== 1 ? 's' : ''}`;
}

function showSuccess(message) {
  showNotification(message, 'success');
}

function showError(message) {
  showNotification(message, 'error');
}

function showNotification(message, type) {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add('show'), 10);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function handleKeyDown(event) {
  // Ctrl+Shift+1 for SHA-1
  if (event.ctrlKey && event.shiftKey && event.key === '1') {
    event.preventDefault();
    if (document.activeElement === inputTextarea) {
      generateSHA1();
    }
  }

  // Ctrl+Shift+2 for SHA-256
  if (event.ctrlKey && event.shiftKey && event.key === '2') {
    event.preventDefault();
    if (document.activeElement === inputTextarea) {
      generateSHA256();
    }
  }

  // Ctrl+C on output to copy
  if (event.ctrlKey && event.key === 'c' && document.activeElement === outputTextarea) {
    event.preventDefault();
    copyToClipboard();
  }
}

// Auto-resize textareas
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  inputTextarea = document.getElementById('input');
  outputTextarea = document.getElementById('output');
  inputCharCount = document.getElementById('input-char-count');

  const sha1Btn = document.getElementById('sha1-btn');
  const sha256Btn = document.getElementById('sha256-btn');
  const copyBtn = document.getElementById('copy-output-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const clearOutputBtn = document.getElementById('clear-output-btn');

  // Event listeners
  sha1Btn.addEventListener('click', generateSHA1);
  sha256Btn.addEventListener('click', generateSHA256);
  copyBtn.addEventListener('click', copyToClipboard);
  clearInputBtn.addEventListener('click', clearInput);
  clearOutputBtn.addEventListener('click', clearOutput);

  inputTextarea.addEventListener('input', updateCharCount);
  inputTextarea.addEventListener('input', () => autoResizeTextarea(inputTextarea));
  outputTextarea.addEventListener('input', () => autoResizeTextarea(outputTextarea));

  document.addEventListener('keydown', handleKeyDown);

  // Initial setup
  updateCharCount();
  autoResizeTextarea(inputTextarea);
  autoResizeTextarea(outputTextarea);
});