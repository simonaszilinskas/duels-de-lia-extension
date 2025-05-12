// utils.js - Utility functions for the extension

// Function to get the active path object based on the path ID
export function getActivePath(workshopPaths, currentSettings) {
  return workshopPaths[currentSettings.activePath];
}

// Function to get steps for current page
export function getStepsForCurrentPage(activePath, stepsLibrary, pageName) {
  if (!activePath) return [];
  
  return activePath.steps
    .map(stepId => stepsLibrary[stepId])
    .filter(step => step && step.pages.includes(pageName))
    .sort((a, b) => a.order - b.order);
}

// Function to detect page type on ComparIA
export function detectPageType() {
  const isMainPage = window.location.pathname === "/" || window.location.pathname === "";
  const isModelSelectionPage = window.location.href.includes("/arene") && 
                            document.body.textContent.includes("Sélection des modèles");
  const isDuelPage = window.location.href.includes("/arene") && 
                    !document.body.textContent.includes("Sélection des modèles");
  
  if (isMainPage) return 'main';
  if (isModelSelectionPage) return 'model_selection';
  if (isDuelPage) return 'duel';
  return 'unknown';
}

// Function to create a URL change observer
export function createUrlChangeObserver(callback) {
  let lastUrl = window.location.href;
  
  // Create a MutationObserver to watch for URL changes
  const observer = new MutationObserver(() => {
    // Check for URL changes
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      callback();
    }
  });
  
  // Start observing
  observer.observe(document, { subtree: true, childList: true });
  
  return observer;
}