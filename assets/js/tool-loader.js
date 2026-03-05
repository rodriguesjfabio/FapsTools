async function loadTools() {
  const response = await fetch("/tools/registry.json");
  const data = await response.json();

  return data.tools;
}

async function renderTools(containerId, category = null) {
  const tools = await loadTools();
  const container = document.getElementById(containerId);

  container.innerHTML = "";

  tools.forEach((tool) => {
    if (category && tool.category !== category) return;

    const card = document.createElement("a");

    card.className = "card";
    card.href = tool.path;

    card.innerHTML = `
            <h3>${tool.name}</h3>
            <p>${tool.description}</p>
        `;

    container.appendChild(card);
  });
}
