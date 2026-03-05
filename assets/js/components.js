async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    const html = await response.text();

    const element = document.getElementById(id);

    if (element) {
      element.innerHTML = html;
    }
  } catch (error) {
    console.error(`Error loading component ${file}`, error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("navbar", "/components/navbar.html");
  loadComponent("footer", "/components/footer.html");
});
