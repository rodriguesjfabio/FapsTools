// Fuzzy search implementation
let allTools = [];

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();

  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1)
    .fill(null)
    .map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= len2; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i] + 1, // deletion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[len2][len1];
}

// Calculate similarity score (0 to 1, where 1 is identical)
function calculateSimilarityScore(searchTerm, toolName, toolDescription) {
  const searchLower = searchTerm.toLowerCase();
  const nameLower = toolName.toLowerCase();
  const descLower = toolDescription.toLowerCase();

  // Exact match gets highest score
  if (nameLower === searchLower) {
    return 1.0;
  }

  // Starts with search term
  if (nameLower.startsWith(searchLower)) {
    return 0.9;
  }

  // Contains search term as substring
  if (nameLower.includes(searchLower)) {
    return 0.8;
  }

  // Check description
  if (descLower.includes(searchLower)) {
    return 0.5;
  }

  // Fuzzy match on name
  const maxLen = Math.max(searchLower.length, nameLower.length);
  const distance = levenshteinDistance(searchLower, nameLower);
  const similarity = 1 - distance / maxLen;

  return Math.max(0, similarity * 0.7);
}

// Load tools and initialize search
async function initializeSearch() {
  try {
    const response = await fetch('/data/tools.json');
    const data = await response.json();
    allTools = data.tools || [];
    setupSearchEventListeners();
  } catch (error) {
    console.error('Failed to load tools for search:', error);
  }
}

function setupSearchEventListeners() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput) {
    // Search elements not loaded yet, try again in a moment
    setTimeout(setupSearchEventListeners, 100);
    return;
  }

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();

    if (!searchTerm || searchTerm.length < 1) {
      searchResults.style.display = 'none';
      return;
    }

    performSearch(searchTerm);
  });

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchResults.style.display = 'none';
    }
  });

  // Show results again when focusing input
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 1) {
      performSearch(searchInput.value.trim());
    }
  });
}

function performSearch(searchTerm) {
  const searchResults = document.getElementById('search-results');

  // Score all tools
  const scoredTools = allTools
    .map((tool) => ({
      ...tool,
      score: calculateSimilarityScore(searchTerm, tool.name, tool.description),
    }))
    .filter((tool) => tool.score > 0.3) // Filter out very poor matches
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, 8); // Limit to 8 results

  // Display results
  if (scoredTools.length === 0) {
    searchResults.innerHTML =
      '<div class="search-no-results">Nenhuma ferramenta encontrada</div>';
  } else {
    searchResults.innerHTML = scoredTools
      .map(
        (tool) =>
          `
      <a href="/tools/${tool.slug}/" class="search-result-item">
        <div class="search-result-icon">${tool.icon}</div>
        <div class="search-result-info">
          <div class="search-result-name">${tool.name}</div>
          <div class="search-result-description">${tool.description}</div>
        </div>
      </a>
    `
      )
      .join('');
  }

  searchResults.style.display = 'block';
}

// Initialize when DOM is ready or when search is injected
function tryInitializeSearch() {
  if (document.getElementById('search-input')) {
    initializeSearch();
  } else {
    // Try again after a short delay
    setTimeout(tryInitializeSearch, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryInitializeSearch);
} else {
  tryInitializeSearch();
}