function encodeBase64() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  try {
    output.value = btoa(input);
  } catch (err) {
    output.value = "Invalid input";
  }
}

function decodeBase64() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");

  try {
    output.value = atob(input);
  } catch (err) {
    output.value = "Invalid Base64";
  }
}

document.getElementById("encode").addEventListener("click", encodeBase64);
document.getElementById("decode").addEventListener("click", decodeBase64);
