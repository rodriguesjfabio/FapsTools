/* simple i18n support using hardcoded translations */
const translations = {
  en: {
    home: "Home",
    tools: "Tools",
    about: "About",
    search_placeholder: "Search tool...",
    about_header: "About FapsTools 😊",
    about_paragraph1: "Welcome to FapsTools – a collection of browser-based utilities designed to make common developer and everyday tasks a little bit easier. This project is meant as a playground for simple, useful tools that run entirely in your web browser with no server-side processing.",
    about_paragraph2: "Whether you need to encode/decode data, format JSON, manipulate PDF files, or just play with some random generators, this site aims to have something handy for every situation. The goal is to gather helpful utilities in one place and hopefully save you a few clicks and search results along the way.",
    about_paragraph3: "Feel free to explore the tools and suggest new ideas (coming soon!). Happy coding! 🚀",
    categories_heading: "Categories",
    home_header: "FapsTools",
    home_subtitle: "Free browser tools for developers and everyday tasks.",
    tools_title: "All Tools",
    tools_description: "Browse all available tools.",
    base64_input_header: "Input Text",
    base64_output_header: "Output",
    base64_encode_btn: "Encode to Base64",
    base64_decode_btn: "Decode from Base64",
    base64_input_placeholder: "Enter text here...",
    base64_output_placeholder: "Result will appear here...",
    json_input_header: "Input JSON",
    json_format_btn: "Format JSON",
    json_minify_btn: "Minify JSON",
    json_validate_btn: "Validate JSON",
    json_input_placeholder: "Paste your JSON here...",
    json_output_placeholder: "Formatted JSON will appear here...",
    privacy_header: "Privacy Policy",
    privacy_paragraph: "This tool does not collect or store any personal data; everything runs locally in your browser.",
    terms_header: "Terms of Use",
    terms_paragraph: "By using this site you agree that resources are provided \"as is\" and without warranties."
  },
  pt: {
    home: "Início",
    tools: "Ferramentas",
    about: "Sobre",
    search_placeholder: "Buscar ferramenta...",
    about_header: "Sobre o FapsTools 😊",
    about_paragraph1: "Bem-vindo ao FapsTools – uma coleção de utilitários que rodam no navegador, projetada para facilitar tarefas comuns de desenvolvedor e do dia a dia. Este projeto serve como um playground para ferramentas simples e úteis que operam inteiramente no seu navegador, sem processamento no servidor.",
    about_paragraph2: "Se você precisa codificar/decodificar dados, formatar JSON, manipular arquivos PDF ou apenas brincar com alguns geradores aleatórios, este site busca ter algo útil para cada situação. O objetivo é reunir utilitários práticos em um só lugar e, esperançosamente, economizar alguns cliques e pesquisas.",
    about_paragraph3: "Sinta-se à vontade para explorar as ferramentas e sugerir novas ideias (em breve!). Feliz codificação! 🚀",
    categories_heading: "Categorias",
    home_header: "FapsTools",
    home_subtitle: "Ferramentas de navegador gratuitas para desenvolvedores e tarefas do dia a dia.",
    tools_title: "Todas as ferramentas",
    tools_description: "Explore todas as ferramentas disponíveis.",
    base64_input_header: "Texto de entrada",
    base64_output_header: "Saída",
    base64_encode_btn: "Codificar para Base64",
    base64_decode_btn: "Decodificar de Base64",
    base64_input_placeholder: "Digite o texto aqui...",
    base64_output_placeholder: "O resultado aparecerá aqui...",
    json_input_header: "JSON de entrada",
    json_format_btn: "Formatar JSON",
    json_minify_btn: "Minificar JSON",
    json_validate_btn: "Validar JSON",
    json_input_placeholder: "Cole seu JSON aqui...",
    json_output_placeholder: "O JSON formatado aparecerá aqui...",
    no_results: "Nenhuma ferramenta encontrada",
    privacy_header: "Política de Privacidade",
    privacy_paragraph: "Esta ferramenta não coleta nem armazena dados pessoais; tudo é executado localmente em seu navegador.",
    terms_header: "Termos de Uso",
    terms_paragraph: "Ao usar este site, você concorda que os recursos são fornecidos \"como estão\" e sem garantias."
  },
  es: {
    home: "Inicio",
    tools: "Herramientas",
    about: "Acerca de",
    search_placeholder: "Buscar herramienta...",
    home_header: "FapsTools",
    home_subtitle: "Herramientas gratuitas del navegador para desarrolladores y tareas diarias.",
    categories_heading: "Categorías",
    about_header: "Acerca de FapsTools 😊",
    about_paragraph1: "Bienvenido a FapsTools, una colección de utilidades basadas en el navegador diseñadas para facilitar tareas comunes de desarrolladores y del día a día. Este proyecto es un espacio para herramientas simples y útiles que se ejecutan íntegramente en su navegador sin procesamiento del servidor.",
    about_paragraph2: "Ya sea que necesite codificar/decodificar datos, formatear JSON, manipular archivos PDF o simplemente jugar con algunos generadores aleatorios, este sitio pretende tener algo útil para cada situación. El objetivo es reunir útiles utilidades en un solo lugar y, con suerte, ahorrarle algunos clics y búsquedas.",
    about_paragraph3: "Siéntase libre de explorar las herramientas y sugerir nuevas ideas (¡próximamente!). ¡Felices codificaciones! 🚀",
    base64_input_header: "Texto de entrada",
    base64_output_header: "Salida",
    base64_encode_btn: "Codificar a Base64",
    base64_decode_btn: "Decodificar desde Base64",
    base64_input_placeholder: "Ingrese texto aquí...",
    base64_output_placeholder: "El resultado aparecerá aquí...",
    json_input_header: "JSON de entrada",
    json_format_btn: "Formatear JSON",
    json_minify_btn: "Minificar JSON",
    json_validate_btn: "Validar JSON",
    json_input_placeholder: "Pegue su JSON aquí...",
    json_output_placeholder: "El JSON formateado aparecerá aquí..."
  }
};

function getLanguage() {
  return localStorage.getItem('ft_lang') || 'en';
}

// simple helper to retrieve translation by key
function t(key) {
  const lang = getLanguage();
  if (translations[lang] && translations[lang][key]) {
    return translations[lang][key];
  }
  // fallback to english or the key itself
  return (translations.en && translations.en[key]) || key;
}

function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('ft_lang', lang);
    // reload page to ensure any dynamically rendered text (cards, tool names, etc.) uses new language
    window.location.reload();
  }
}

function applyTranslations() {
  const lang = getLanguage();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    const placeholderKey = 'search_placeholder';
    searchInput.placeholder = translations[lang][placeholderKey] || searchInput.placeholder;
  }

  // placeholder translation for any element using data-placeholder-i18n
  document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
    const key = el.getAttribute('data-placeholder-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.setAttribute('placeholder', translations[lang][key]);
    }
  });
}

// initialization that works regardless of when the script is injected
function initI18n() {
  document.getElementById('lang-en')?.addEventListener('click', () => setLanguage('en'));
  document.getElementById('lang-pt')?.addEventListener('click', () => setLanguage('pt'));
  document.getElementById('lang-es')?.addEventListener('click', () => setLanguage('es'));
  applyTranslations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initI18n);
} else {
  initI18n();
}
