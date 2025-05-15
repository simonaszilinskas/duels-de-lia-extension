// styles.js - Dynamic CSS loader for the extension

/**
 * Dynamically loads CSS files from the extension
 * All styles moved to external CSS files instead of inline JavaScript
 */
export function injectGlobalStyles() {
  const cssFiles = [
    'base.css',
    'guide-ui.css',
    'content.css',
    'steps-components.css',
    'resources-components.css',
    'suggestions-components.css',
    'facilitator-styles.css'
  ];

  cssFiles.forEach(cssFile => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL(`src/css/${cssFile}`);
    document.head.appendChild(link);
  });
}

// Function to load Font Awesome if it's not already loaded
export function loadFontAwesome() {
  if (!document.getElementById('fontawesome-css')) {
    const fontAwesome = document.createElement('link');
    fontAwesome.id = 'fontawesome-css';
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(fontAwesome);
  }
}