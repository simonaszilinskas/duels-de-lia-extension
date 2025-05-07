// popup.js - Script for the extension popup UI

// Elements we'll need to update
const notOnCompariaMessage = document.getElementById('not-on-comparia-message');
const onCompariaMessage = document.getElementById('on-comparia-message');

// Check if we're on ComparIA site
chrome.storage.local.get(['isComparIASite'], (result) => {
  const isOnComparIASite = result.isComparIASite || false;
  
  // Update the UI based on the site
  if (isOnComparIASite) {
    notOnCompariaMessage.style.display = 'none';
    onCompariaMessage.style.display = 'block';
  } else {
    notOnCompariaMessage.style.display = 'block';
    onCompariaMessage.style.display = 'none';
  }
});

// Also check the active tab directly
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = new URL(tabs[0].url);
  const isOnComparIASite = url.hostname === 'comparia.beta.gouv.fr';

  // Update the UI based on the site
  if (isOnComparIASite) {
    notOnCompariaMessage.style.display = 'none';
    onCompariaMessage.style.display = 'block';
  } else {
    notOnCompariaMessage.style.display = 'block';
    onCompariaMessage.style.display = 'none';
  }
  
  // Store this information
  chrome.storage.local.set({ isComparIASite: isOnComparIASite });
});