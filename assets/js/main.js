async function loadCategories() {
  // Hardcoded categories data for static loading
  const categories = [
    {
      "slug": "dev",
      "name": {
        "en": "Developer Tools",
        "pt": "Ferramentas de Desenvolvedor",
        "es": "Herramientas de Desarrollador"
      },
      "description": {
        "en": "Useful utilities for programmers",
        "pt": "Utilitários úteis para programadores",
        "es": "Utilidades útiles para programadores"
      },
      "icon": "👨‍💻"
    },
    {
      "slug": "pdf",
      "name": {
        "en": "PDF Tools",
        "pt": "Ferramentas de PDF",
        "es": "Herramientas de PDF"
      },
      "description": {
        "en": "Merge, split and edit PDFs",
        "pt": "Mesclar, dividir e editar PDFs",
        "es": "Combinar, dividir y editar PDFs"
      },
      "icon": "📄"
    }
  ];

  const container = document.getElementById("categories-grid");

  if (!container) return;

  container.innerHTML = "";

  categories.forEach((category) => {
    const lang = localStorage.getItem('ft_lang') || 'en';
    const name = category.name?.[lang] || category.name?.en || category.name;
    const desc = category.description?.[lang] || category.description?.en || category.description;

    const card = document.createElement("a");

    card.className = "card";
    card.href = `/tools/?category=${category.slug}`;

    card.innerHTML = `
      <div class="card-icon">${category.icon}</div>
      <div class="card-content">
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});
