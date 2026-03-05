async function loadTools() {
  const response = await fetch("/data/tools.json");
  const data = await response.json();
  return data.tools;
}

async function loadToolPage() {
  const path = window.location.pathname;
  const slug = path.split("/").filter(Boolean).pop();

  const tools = await loadTools();
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) return;

  const title = document.getElementById("tool-title");
  const description = document.getElementById("tool-description");
  const icon = document.getElementById("tool-icon");

  if (title) title.textContent = tool.name;
  if (description) description.textContent = tool.description;
  if (icon) icon.textContent = tool.icon;

  document.title = `${tool.name} | FapsTools`;
}

loadToolPage();
