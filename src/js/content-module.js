// content-module.js - Module version of content.js with imports

import { initializeGuide } from './modules/guide-manager.js';

// Initialize the guide
initializeGuide().catch(error => {
  console.error('Error initializing guide:', error);
});