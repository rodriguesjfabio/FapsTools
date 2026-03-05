const input = document.getElementById("json-input");
const output = document.getElementById("json-output");

const formatBtn = document.getElementById("format-btn");
const minifyBtn = document.getElementById("minify-btn");

formatBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed, null, 2);
  } catch (err) {
    output.value = "Invalid JSON";
  }
});

minifyBtn.addEventListener("click", () => {
  try {
    const parsed = JSON.parse(input.value);
    output.value = JSON.stringify(parsed);
  } catch (err) {
    output.value = "Invalid JSON";
  }
});