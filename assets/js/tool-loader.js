let toolsCache = null;

async function loadTools() {
  if (toolsCache) {
    return toolsCache;
  }

  try {
    const response = await fetch("/data/tools.json");
    const data = await response.json();

    toolsCache = data.tools;

    return toolsCache;
  } catch (error) {
    console.error("Error loading tools:", error);
    return [];
  }
}

async function renderTools(containerId) {
  const tools = await loadTools();
  const container = document.getElementById(containerId);

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  container.innerHTML = "";

  tools.forEach((tool) => {
    if (category && tool.category !== category) return;

    const card = document.createElement("a");

    card.className = "card";
    card.href = `/tools/${tool.slug}/`;

    card.innerHTML = `
      <h3>${tool.name}</h3>
      <p>${tool.description}</p>
    `;

    container.appendChild(card);
  });
}
