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

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("navbar", "/components/navbar.html");
  await loadComponent("footer", "/components/footer.html");
  
  // Load search script for navbar search functionality after navbar is loaded
  await loadScript("/assets/js/search.js").catch(error => {
    console.error("Error loading search script", error);
  });
});
