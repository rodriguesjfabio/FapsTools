async function loadCategories() {
  try {
    const response = await fetch("/data/categories.json");
    const categories = await response.json();

    const container = document.getElementById("categories-grid");

    if (!container) return;

    container.innerHTML = "";

    categories.forEach((category) => {
      const card = document.createElement("a");

      card.className = "card";
      card.href = `/tools/?category=${category.slug}`;

      card.innerHTML = `
        <h3>${category.name}</h3>
        <p>${category.description}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});
