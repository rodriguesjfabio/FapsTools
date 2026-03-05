let jwtInput = null;
let headerOutput = null;
let payloadOutput = null;
let signatureOutput = null;
let inputCharCount = null;

function decodeJWT() {
  const token = jwtInput.value.trim();

  if (!token) {
    clearAllOutputs();
    return;
  }

  try {
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. JWT must have exactly 3 parts separated by dots.');
    }

    // Decode header
    const header = JSON.parse(atobUrl(parts[0]));
    headerOutput.value = JSON.stringify(header, null, 2);

    // Decode payload
    const payload = JSON.parse(atobUrl(parts[1]));
    payloadOutput.value = JSON.stringify(payload, null, 2);

    // Show signature (not decoded, just the raw value)
    signatureOutput.value = parts[2];

    showSuccess("JWT decoded successfully!");
  } catch (err) {
    clearAllOutputs();
    showError(err.message || "Invalid JWT token");
  }
}

function atobUrl(base64Url) {
  // Convert base64url to base64
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }

  return atob(base64);
}

function copyToClipboard(text) {
  if (!text.trim()) {
    showError("Nothing to copy!");
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    showSuccess("Copied to clipboard!");
  }).catch(err => {
    console.error('Failed to copy: ', err);
    showError("Failed to copy to clipboard");
  });
}

function clearInput() {
  jwtInput.value = "";
  updateCharCount();
  clearAllOutputs();
  jwtInput.focus();
}

function clearAllOutputs() {
  headerOutput.value = "";
  payloadOutput.value = "";
  signatureOutput.value = "";
}

function updateCharCount() {
  const text = jwtInput.value;
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
  // Ctrl+Enter to decode
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault();
    if (document.activeElement === jwtInput) {
      decodeJWT();
    }
  }
}

// Auto-resize textareas
function autoResizeTextarea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  jwtInput = document.getElementById('jwt-input');
  headerOutput = document.getElementById('header-output');
  payloadOutput = document.getElementById('payload-output');
  signatureOutput = document.getElementById('signature-output');
  inputCharCount = document.getElementById('input-char-count');

  const decodeBtn = document.getElementById('decode-btn');
  const clearInputBtn = document.getElementById('clear-input-btn');
  const copyHeaderBtn = document.getElementById('copy-header-btn');
  const copyPayloadBtn = document.getElementById('copy-payload-btn');
  const copySignatureBtn = document.getElementById('copy-signature-btn');

  // Event listeners
  decodeBtn.addEventListener('click', decodeJWT);
  clearInputBtn.addEventListener('click', clearInput);
  copyHeaderBtn.addEventListener('click', () => copyToClipboard(headerOutput.value));
  copyPayloadBtn.addEventListener('click', () => copyToClipboard(payloadOutput.value));
  copySignatureBtn.addEventListener('click', () => copyToClipboard(signatureOutput.value));

  jwtInput.addEventListener('input', updateCharCount);
  jwtInput.addEventListener('input', () => autoResizeTextarea(jwtInput));
  headerOutput.addEventListener('input', () => autoResizeTextarea(headerOutput));
  payloadOutput.addEventListener('input', () => autoResizeTextarea(payloadOutput));
  signatureOutput.addEventListener('input', () => autoResizeTextarea(signatureOutput));

  document.addEventListener('keydown', handleKeyDown);

  // Initial setup
  updateCharCount();
  autoResizeTextarea(jwtInput);
  autoResizeTextarea(headerOutput);
  autoResizeTextarea(payloadOutput);
  autoResizeTextarea(signatureOutput);
});