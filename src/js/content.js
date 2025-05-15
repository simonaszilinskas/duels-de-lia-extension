// content.js - Script that runs directly on the ComparIA website
// Now using ES modules for better organization

// Load CSS resources
function loadStyles() {
  // DSFR CSS (Marianne font)
  const dfsrCSS = document.createElement('link');
  dfsrCSS.rel = 'stylesheet';
  dfsrCSS.href = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/dsfr.min.css';
  document.head.appendChild(dfsrCSS);
  
  // Extension CSS files
  const stylesheets = [
    'guide-ui.css',
    'steps-components.css',
    'resources-components.css',
    'suggestions-components.css'
  ];
  
  stylesheets.forEach(stylesheet => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL(`css/${stylesheet}`);
    document.head.appendChild(link);
  });
}

// Import modules
import { initializeGuide } from './modules/guide-manager.js';

// Main initialization
function initialize() {
  // Check if we're on the ComparIA site
  const isComparIASite = window.location.hostname === "comparia.beta.gouv.fr";
  
  // Notify the background script about our current domain
  chrome.runtime.sendMessage({ 
    action: "checkDomain", 
    isComparIASite: isComparIASite 
  });
  
  // Load CSS resources
  loadStyles();
  
  // Initialize the guide if we're on the ComparIA site
  if (isComparIASite) {
    initializeGuide();
  }
}

// Start the extension
initialize();