// background.js - Service worker for Les Duels de l'IA extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Les Duels de l'IA extension installed");
  
  // Initialize storage with default values
  chrome.storage.local.set({
    currentStep: 1,
    isComparIASite: false
  });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "checkDomain") {
    sendResponse({ isComparIASite: message.isComparIASite });
    
    // Update the storage with domain status
    chrome.storage.local.set({ isComparIASite: message.isComparIASite });
  }
  else if (message.action === "updateStep") {
    chrome.storage.local.set({ currentStep: message.step });
    sendResponse({ success: true });
  }
  
  return true; // Required for async response
});