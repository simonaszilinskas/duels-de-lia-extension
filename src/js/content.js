// content.js - Script that runs directly on the ComparIA website
// This is a simplified version that only loads the DSFR CSS for styling

// Charger la police Marianne via le CSS DSFR
const dfsrCSS = document.createElement('link');
dfsrCSS.rel = 'stylesheet';
dfsrCSS.href = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/dsfr.min.css';
document.head.appendChild(dfsrCSS);

// Check if we're on the ComparIA site
const isComparIASite = window.location.hostname === "comparia.beta.gouv.fr";

// Notify the background script about our current domain
chrome.runtime.sendMessage({ 
  action: "checkDomain", 
  isComparIASite: isComparIASite 
});

// This file intentionally contains minimal code as the functionality
// has been moved to the modular system in content-wrapper.js
console.log('Duels extension content script loaded');

// The actual guide functionality is loaded by content-wrapper.js
// which uses the ES module system to properly handle dependencies