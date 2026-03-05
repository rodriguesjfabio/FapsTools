let inputTextarea = null;
let outputTextarea = null;
let inputCharCount = null;
let outputCharCount = null;

function formatJSON() {
  const input = inputTextarea.value;
  const output = outputTextarea;

  if (!input.trim()) {
    output.value = "";
    updateCharCounts();
    return;
  }

  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed, null, 2);
    updateCharCounts();
    showSuccess("JSON formatted successfully!");
  } catch (err) {
    output.value = `Error: Invalid JSON\n${err.message}`;
    updateCharCounts();
    showError("Invalid JSON format");
  }
}

function minifyJSON() {
  const input = inputTextarea.value;
  const output = outputTextarea;

  if (!input.trim()) {
    output.value = "";
    updateCharCounts();
    return;
  }

  try {
    const parsed = JSON.parse(input);
    output.value = JSON.stringify(parsed);
    updateCharCounts();
    showSuccess("JSON minified successfully!");
  } catch (err) {
    output.value = `Error: Invalid JSON\n${err.message}`;
    updateCharCounts();
    showError("Invalid JSON format");
  }
}

function validateJSON() {
  const input = inputTextarea.value;

  if (!input.trim()) {
    showError("Please enter some JSON to validate");
    return;
  }

  try {
    JSON.parse(input);
    showSuccess("✅ Valid JSON!");
  } catch (err) {
    showError(`❌ Invalid JSON: ${err.message}`);
  }
}

function copyToClipboard() {
  const output = outputTextarea.value;

  if (!output.trim()) {
    showError("Nothing to copy!");
    return;
  }

  navigator.clipboard.writeText(output).then(() => {
    showSuccess("Copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showError("Failed to copy to clipboard");
  });
}

function clearInput() {
  inputTextarea.value = "";
  updateCharCounts();
  inputTextarea.focus();
}

function clearOutput() {
  outputTextarea.value = "";
  updateCharCounts();
}

function updateCharCounts() {
  const inputText = inputTextarea.value;
  const outputText = outputTextarea.value;

  inputCharCount.textContent = `${inputText.length} character${inputText.length !== 1 ? 's' : ''}`;
  outputCharCount.textContent = `${outputText.length} character${outputText.length !== 1 ? 's' : ''}`;
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
  // Ctrl+Enter to format
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    if (document.activeElement === inputTextarea) {
      formatJSON();
    }
  }

  // Ctrl+Shift+Enter to minify
  if (event.ctrlKey && event.shiftKey && event.key === 'Enter') {
    event.preventDefault();
    if (document.activeElement === inputTextarea) {
      minifyJSON();
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
  inputTextarea = document.getElementById('json-input');
  outputTextarea = document.getElementById('json-output');
  inputCharCount = document.getElementById('input-char-count');
  outputCharCount = document.getElementById('output-char-count');

  const formatBtn = document.getElementById('format-btn');
  const minifyBtn = document.getElementById('minify-btn');
  const validateBtn = document.getElementById('validate-btn');
  const copyBtn = document.getElementById('copy-output-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const clearOutputBtn = document.getElementById('clear-output-btn');

  // Event listeners
  formatBtn.addEventListener('click', formatJSON);
  minifyBtn.addEventListener('click', minifyJSON);
  validateBtn.addEventListener('click', validateJSON);
  copyBtn.addEventListener('click', copyToClipboard);
  clearInputBtn.addEventListener('click', clearInput);
  clearOutputBtn.addEventListener('click', clearOutput);

  inputTextarea.addEventListener('input', updateCharCounts);
  inputTextarea.addEventListener('input', () => autoResizeTextarea(inputTextarea));
  outputTextarea.addEventListener('input', updateCharCounts);
  outputTextarea.addEventListener('input', () => autoResizeTextarea(outputTextarea));

  document.addEventListener('keydown', handleKeyDown);

  // Initial setup
  updateCharCounts();
  autoResizeTextarea(inputTextarea);
  autoResizeTextarea(outputTextarea);
});