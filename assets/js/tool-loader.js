let toolsCache = null;

async function loadTools() {
  if (toolsCache) {
    return toolsCache;
  }

  // Hardcoded tools data for static loading
  const data = {
    "tools": [
      {
        "name": {
          "en": "Base64 Encoder / Decoder",
          "pt": "Codificador / Decodificador Base64",
          "es": "Codificador / Decodificador Base64"
        },
        "slug": "base64",
        "category": "dev",
        "description": {
          "en": "Encode and decode Base64 strings",
          "pt": "Codifique e decodifique strings Base64",
          "es": "Codifica y decodifica cadenas Base64"
        },
        "icon": "🔐"
      },
      {
        "name": {
          "en": "JSON Formatter",
          "pt": "Formatador JSON",
          "es": "Formateador JSON"
        },
        "slug": "json-formatter",
        "category": "dev",
        "description": {
          "en": "Format and validate JSON",
          "pt": "Formate e valide JSON",
          "es": "Formatea y valida JSON"
        },
        "icon": "{ }"
      },
      {
        "name": {
          "en": "PDF Merger",
          "pt": "Mesclador de PDF",
          "es": "Combinador de PDF"
        },
        "slug": "pdf-merge",
        "category": "pdf",
        "description": {
          "en": "Merge multiple PDF files into one",
          "pt": "Mescle vários arquivos PDF em um",
          "es": "Combina varios archivos PDF en uno"
        },
        "icon": "📑"
      },
      {
        "name": {
          "en": "PDF Splitter",
          "pt": "Divisor de PDF",
          "es": "Divisor de PDF"
        },
        "slug": "pdf-split",
        "category": "pdf",
        "description": {
          "en": "Split PDF files into multiple documents",
          "pt": "Divida arquivos PDF em vários documentos",
          "es": "Divide archivos PDF en múltiples documentos"
        },
        "icon": "✂️"
      },
      {
        "name": {
          "en": "JWT Decoder",
          "pt": "Decodificador JWT",
          "es": "Decodificador JWT"
        },
        "slug": "jwt-decoder",
        "category": "dev",
        "description": {
          "en": "Decode and inspect JWT tokens",
          "pt": "Decodifique e inspecione tokens JWT",
          "es": "Decodifica e inspecciona tokens JWT"
        },
        "icon": "🔑"
      },
      {
        "name": {
          "en": "Hash Generator",
          "pt": "Gerador de Hash",
          "es": "Generador de Hash"
        },
        "slug": "hash-generator",
        "category": "dev",
        "description": {
          "en": "Generate MD5, SHA-1, and SHA-256 hashes",
          "pt": "Gere hashes MD5, SHA-1 e SHA-256",
          "es": "Genera hashes MD5, SHA-1 y SHA-256"
        },
        "icon": "#️⃣"
      }
    ]
  };

  toolsCache = data.tools;

  return toolsCache;
}

async function renderTools(containerId) {
  const tools = await loadTools();
  const container = document.getElementById(containerId);

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  // update header text based on category parameter
  const headerTitle = document.querySelector(".site-header h1");
  const headerDesc = document.querySelector(".site-header p");
  if (headerTitle && headerDesc) {
    if (category) {
      // hardcoded categories data
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
      const cat = categories.find((c) => c.slug === category);
      if (cat) {
        const lang = localStorage.getItem('ft_lang') || 'en';
        const translatedName = cat.name?.[lang] || cat.name?.en || cat.name;
        const translatedDesc = cat.description?.[lang] || cat.description?.en || cat.description || "";
        headerTitle.textContent = translatedName;
        headerDesc.textContent = translatedDesc;
      }
    } else {
      // applyTranslations will be called by i18n.js init
    }
  }

  container.innerHTML = "";

  tools.forEach((tool) => {
    if (category && tool.category !== category) return;

    const lang = localStorage.getItem('ft_lang') || 'en';
    const tName = tool.name?.[lang] || tool.name?.en || tool.name;
    const tDesc = tool.description?.[lang] || tool.description?.en || tool.description;

    const card = document.createElement("a");

    card.className = "card";
    card.href = `/tools/${tool.slug}/`;

    card.innerHTML = `
      <div class="card-icon">${tool.icon}</div>
      <div class="card-content">
        <h3>${tName}</h3>
        <p>${tDesc}</p>
      </div>
    `;

    container.appendChild(card);
  });
}
