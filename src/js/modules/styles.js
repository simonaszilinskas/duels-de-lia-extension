// styles.js - Styles for the extension components with improved responsiveness

export function injectGlobalStyles() {
  // Charger la police Marianne
  const marianneFont = document.createElement('link');
  marianneFont.rel = 'stylesheet';
  marianneFont.href = 'https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Bold.woff2';
  document.head.appendChild(marianneFont);

  // Style global
  const globalStyle = document.createElement('style');
  globalStyle.textContent = `
    @import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Bold.woff2');
    @import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Regular.woff2');
    @import url('https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.7.2/dist/fonts/Marianne-Medium.woff2');

    .duels-guide {
      font-family: 'Marianne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border: 1px solid #e6e6e6;
      transition: all 0.3s ease;
      position: fixed;
      top: 20px;
      right: 20px;
      width: min(370px, 90vw);
      max-height: 85vh;
      overflow-y: auto;
      background-color: white;
      z-index: 10000;
    }
    
    .duels-guide:not(.open) {
      transform: translateX(calc(100% + 30px));
    }
    
    .duels-header {
      background-color: #6a6af4;
      color: white;
      border-radius: 8px 8px 0 0;
      padding: 15px 20px;
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .duels-header h2 {
      margin: 0;
      font-weight: 700;
      font-size: 1.1rem;
      color: white;
    }
    
    .duels-navbar {
      display: flex;
      align-items: center;
    }
    
    .duels-resources-btn,
    .duels-paths-btn {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.5);
      color: white;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 50%;
      transition: all 0.2s;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .duels-resources-btn:hover,
    .duels-paths-btn:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }
    
    .duels-resources-btn i,
    .duels-paths-btn i {
      font-size: 0.9rem;
    }
    
    .duels-paths-dropdown {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      width: min(300px, 90vw);
      z-index: 10001;
      display: none;
      padding: 20px;
    }
    
    .duels-paths-dropdown.open {
      display: block;
      animation: fadeIn 0.2s ease;
    }
    
    .duels-dropdown-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eaeaea;
    }
    
    .duels-paths-list {
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .duels-path-item {
      display: flex;
      align-items: center;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.2s;
      background-color: #f5f5f5;
      border-left: 3px solid transparent;
    }
    
    .duels-path-item:hover {
      background-color: #e8e8ff;
      transform: translateY(-1px);
    }
    
    .duels-path-item.active {
      border-left: 3px solid #6a6af4;
      background-color: #f0f0ff;
    }
    
    .duels-path-item i {
      font-size: 1rem;
      color: #6a6af4;
      margin-right: 12px;
    }
    
    .duels-path-info {
      flex: 1;
    }
    
    .duels-path-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: #333;
      margin-bottom: 4px;
    }
    
    .duels-path-description {
      font-size: 0.8rem;
      color: #666;
    }
    
    .duels-dropdown-close {
      display: block;
      width: 100%;
      text-align: center;
      margin-top: 15px;
      padding: 8px;
      background-color: #f0f0ff;
      border: 1px solid #6a6af4;
      color: #6a6af4;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 600;
      font-size: 0.85rem;
    }
    
    .duels-dropdown-close:hover {
      background-color: #6a6af4;
      color: white;
    }
    
    .duels-media-container {
      margin: 10px 0;
    }
    
    .duels-media-image,
    .duels-media-gif {
      max-width: 100%;
      border-radius: 4px;
      border: 1px solid #ddd;
      display: block;
      margin-bottom: 5px;
    }
    
    .duels-media-caption {
      font-size: 0.8rem;
      color: #666;
      font-style: italic;
      margin-bottom: 10px;
    }
    
    /* Styles pour les callouts */
    .duels-callout {
      display: flex;
      padding: 10px 12px;
      margin: 8px 0 12px;
      border-radius: 4px;
      border-left: 4px solid;
    }
    
    .duels-callout-icon {
      font-size: 1rem;
      margin-right: 10px;
      flex-shrink: 0;
    }
    
    .duels-callout-content {
      flex: 1;
    }
    
    .duels-callout-title {
      margin-bottom: 4px;
      font-size: 0.85rem;
    }
    
    .duels-callout-text {
      font-size: 0.8rem;
      line-height: 1.4;
    }
    
    /* Types de callouts */
    .duels-callout-important {
      background-color: #fff3cd;
      border-color: #ffc107;
      color: #856404;
    }
    
    .duels-callout-info {
      background-color: #d1ecf1;
      border-color: #0dcaf0;
      color: #0c5460;
    }
    
    .duels-callout-warning {
      background-color: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }
    
    .duels-callout-success {
      background-color: #d4edda;
      border-color: #28a745;
      color: #155724;
    }
    
    .duels-content-container {
      padding: 20px;
      background-color: #fafafa;
      border-radius: 0 0 8px 8px;
      max-height: calc(85vh - 60px);
      overflow-y: auto;
    }
    
    .duels-step {
      margin-bottom: 20px;
    }
    
    .duels-step h3,
    .duels-accordion-header {
      color: #333;
      font-size: 0.95rem;
      margin-bottom: 12px;
    }
    
    .duels-accordion-header {
      background-color: #f5f5f5;
      border-left: 4px solid #9898F8;
      padding: 12px 15px;
      font-weight: 600;
      border-radius: 4px;
      margin-bottom: 2px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .duels-accordion-header:hover {
      background-color: #f0f0ff;
    }
    
    .duels-accordion.active .duels-accordion-header {
      background-color: #e8e8ff;
      color: #000;
    }
    
    .duels-accordion-content {
      padding: 15px;
      background-color: white;
      border-radius: 0 0 4px 4px;
      margin-bottom: 15px;
      display: none;
      border: 1px solid #eaeaea;
      border-top: none;
      line-height: 1.5;
      font-size: 0.85rem;
    }
    
    .duels-accordion.active .duels-accordion-content {
      display: block;
      animation: fadeIn 0.3s ease;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .duels-resource-container {
      margin-top: 15px;
    }
    
    .duels-resources-title {
      margin: 15px 0 10px 0;
      font-weight: 600;
      font-size: 0.9rem;
      color: #333;
    }
    
    .duels-resource-button {
      display: inline-block;
      padding: 8px 15px;
      margin: 5px 10px 5px 0;
      background-color: #6a6af4;
      color: white !important;
      text-decoration: none !important;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.85rem;
      transition: all 0.2s;
      border: none;
      box-shadow: 0 2px 4px rgba(152, 152, 248, 0.3);
      position: relative;
      z-index: 1;
      overflow: hidden;
    }
    
    .duels-resource-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #5252e0;
      z-index: -1;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }
    
    .duels-resource-button:hover {
      color: white !important;
      box-shadow: 0 4px 8px rgba(152, 152, 248, 0.4);
      transform: translateY(-1px);
    }
    
    .duels-resource-button:hover::before {
      transform: scaleX(1);
      transform-origin: left;
    }
    
    .duels-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #9898F8;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: white;
      cursor: pointer;
      z-index: 10000;
      transition: all 0.2s;
    }
    
    .duels-fab:hover {
      transform: scale(1.05);
      background-color: #8080ff;
      box-shadow: 0 4px 12px rgba(152, 152, 248, 0.5);
    }
    
    .duels-model-instruction {
      background-color: #f0f0ff;
      border-left: 3px solid #9898F8;
      padding: 10px 15px;
      margin: 15px 0;
      border-radius: 0 4px 4px 0;
      font-size: 0.85rem;
    }
    
    .duels-suggestion {
      background-color: white;
      padding: 10px 15px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #e0e0e0;
      transition: all 0.2s;
      font-size: 0.85rem;
    }
    
    .duels-suggestion:hover {
      background-color: #f5f5ff;
      border-color: #9898F8;
      box-shadow: 0 2px 5px rgba(152, 152, 248, 0.2);
    }
    
    .duels-suggestion.copied {
      background-color: #ebfbee;
      border-color: #4caf50;
    }
    
    /* Style pour les personas et prompts */
    .duels-persona {
      background-color: white;
      padding: 10px 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      cursor: pointer;
      border: 1px solid #e0e0e0;
      transition: all 0.2s;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .duels-persona:hover {
      background-color: #f5f5ff;
      border-color: #9898F8;
      box-shadow: 0 2px 5px rgba(152, 152, 248, 0.2);
    }
    
    .duels-persona::after {
      content: '▼';
      font-size: 0.7rem;
      color: #777;
      transition: transform 0.2s;
    }
    
    .duels-persona.open::after {
      transform: rotate(180deg);
    }
    
    .duels-prompt {
      padding: 8px 10px 10px;
      margin-top: -6px;
      margin-bottom: 8px;
      background-color: #f8f8ff;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 4px 4px;
      font-size: 0.8rem;
      display: none;
      color: #555;
      position: relative;
    }
    
    .duels-prompt.visible {
      display: block;
      animation: fadeIn 0.2s ease;
    }
    
    .duels-copy-button {
      position: absolute;
      bottom: 8px;
      right: 8px;
      background-color: #9898F8;
      color: white;
      border: none;
      border-radius: 3px;
      padding: 3px 6px;
      font-size: 0.75rem;
      cursor: pointer;
      opacity: 0.8;
      transition: all 0.2s;
    }
    
    .duels-copy-button:hover {
      opacity: 1;
      transform: translateY(-1px);
    }
    
    .duels-prompt.copied .duels-copy-button {
      background-color: #4caf50;
    }
    
    .duels-links {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
      text-align: center;
    }
    
    .duels-link {
      color: #9898F8;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s;
      font-size: 0.85rem;
    }
    
    .duels-link:hover {
      color: #7070ff;
      text-decoration: underline;
    }
    
    #duels-resources-panel {
      background-color: #f0f0ff;
      border-radius: 0 0 8px 8px;
    }
    
    .duels-resources-section {
      margin-bottom: 30px;
      border-bottom: 1px solid rgba(106, 106, 244, 0.2);
      padding-bottom: 20px;
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 5px rgba(106, 106, 244, 0.1);
      margin-bottom: 15px;
    }
    
    .duels-resources-section:last-child {
      margin-bottom: 0;
    }
    
    .duels-resources-section-title {
      color: #6a6af4;
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 5px;
      border-bottom: 2px solid #6a6af4;
      display: inline-block;
    }
    
    .duels-back-to-steps {
      display: inline-block;
      padding: 6px;
      background-color: white;
      color: #6a6af4;
      border: 2px solid #6a6af4;
      border-radius: 50%;
      font-weight: 600;
      margin-bottom: 15px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
    }
    
    .duels-back-to-steps:hover {
      background-color: #6a6af4;
      color: white;
      transform: translateY(-1px);
    }
    
    .duels-back-to-steps i {
      font-size: 0.9rem;
    }
    
    .duels-close-button {
      position: absolute;
      top: 15px;
      right: 15px;
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    
    .duels-close-button:hover {
      opacity: 1;
    }
    
    /* Media queries for better responsiveness */
    @media (max-width: 768px) {
      .duels-guide {
        width: min(350px, 90vw);
      }
      
      .duels-content-container {
        padding: 15px;
      }
      
      .duels-header {
        padding: 12px 15px;
      }
      
      .duels-header h2 {
        font-size: 1rem;
      }
    }
    
    @media (max-width: 480px) {
      .duels-guide {
        width: 90vw;
        top: 10px;
        right: 5vw;
      }
      
      .duels-content-container {
        padding: 10px;
      }
      
      .duels-resources-section {
        padding: 15px;
      }
    }
  `;
  document.head.appendChild(globalStyle);
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