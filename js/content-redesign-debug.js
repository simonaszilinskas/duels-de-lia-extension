// Debug version to help identify issues
(function() {
  'use strict';
  
  console.log('Duels IA Debug - Script loaded');
  
  // More detailed URL checking
  const currentUrl = window.location.href;
  console.log('Duels IA Debug - Full URL:', currentUrl);
  console.log('Duels IA Debug - Hostname:', window.location.hostname);
  console.log('Duels IA Debug - Pathname:', window.location.pathname);
  
  // Check multiple URL patterns
  const isArenaPage = currentUrl.includes('comparia.beta.gouv.fr/arene') || 
                      window.location.pathname.startsWith('/arene');
  
  console.log('Duels IA Debug - Is arena page?', isArenaPage);
  
  if (!isArenaPage) {
    console.log('Duels IA Debug - Not on arena page, exiting');
    return;
  }
  
  // Wait for page to be fully loaded with multiple strategies
  function tryInitialize() {
    console.log('Duels IA Debug - Attempting initialization...');
    
    // Check if FAB already exists
    if (document.getElementById('duelsia-fab')) {
      console.log('Duels IA Debug - FAB already exists');
      return;
    }
    
    // Check if body exists
    if (!document.body) {
      console.log('Duels IA Debug - Body not ready, retrying in 100ms');
      setTimeout(tryInitialize, 100);
      return;
    }
    
    // Create FAB with enhanced visibility
    const fab = document.createElement('button');
    fab.id = 'duelsia-fab';
    fab.innerHTML = '⚔️';
    fab.title = 'Duels de l\'IA';
    
    // Force high z-index and visibility
    fab.style.cssText = `
      position: fixed !important;
      bottom: 30px !important;
      right: 30px !important;
      z-index: 999999 !important;
      width: 60px !important;
      height: 60px !important;
      background: linear-gradient(135deg, #667eea, #764ba2) !important;
      border: none !important;
      border-radius: 50% !important;
      font-size: 30px !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    `;
    
    document.body.appendChild(fab);
    console.log('Duels IA Debug - FAB created and appended');
    
    // Verify FAB is visible
    const fabElement = document.getElementById('duelsia-fab');
    if (fabElement) {
      const rect = fabElement.getBoundingClientRect();
      console.log('Duels IA Debug - FAB position:', {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0
      });
    }
  }
  
  // Try multiple initialization strategies
  console.log('Duels IA Debug - Document readyState:', document.readyState);
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInitialize);
  } else {
    tryInitialize();
  }
  
  // Also try after a delay as fallback
  setTimeout(tryInitialize, 1000);
  
  // And on window load
  window.addEventListener('load', tryInitialize);
  
})();