// guide-manager.js - Functions for creating and managing guides
// Now using modern async/await patterns for better code organization

import { 
  createStepsContainer, 
  createAccordionElement,
  createStepElement 
} from './guide-builder.js';

import { createResourcesPanel, createGuideBase } from './components.js';
import { getActivePath, detectPageType } from './utils.js';
import { workshopPaths, stepsLibrary, commonResources } from './config.js';

// State variables
let isGuideOpen = false;
let showingResources = false;
let currentSettings = {
  activePath: "duels",
  showCompletedSteps: true,
  currentStep: 1
};

/**
 * Function to toggle the guide visibility
 * @returns {Promise<void>}
 */
async function toggleGuide() {
  const guide = document.getElementById('duels-guide');
  if (!guide) return;
  
  isGuideOpen = !isGuideOpen;
  
  // Use a promise to handle the transition
  await new Promise(resolve => {
    if (isGuideOpen) {
      guide.classList.add('open');
    } else {
      guide.classList.remove('open');
      // Reset to steps view when closing
      showingResources = false;
      updateGuideContent();
    }
    
    // Resolve after a short delay to allow transition to complete
    setTimeout(resolve, 300);
  });
}

/**
 * Function to toggle between steps and resources
 * @returns {Promise<void>}
 */
async function toggleResources() {
  showingResources = !showingResources;
  await updateGuideContent();
}

/**
 * Function to update the guide content based on current state
 * @returns {Promise<void>}
 */
async function updateGuideContent() {
  return new Promise(resolve => {
    const stepsContainer = document.getElementById('duels-steps-container');
    const resourcesContainer = document.getElementById('duels-resources-panel');
    
    if (showingResources) {
      if (stepsContainer) stepsContainer.style.display = 'none';
      if (resourcesContainer) resourcesContainer.style.display = 'block';
    } else {
      if (stepsContainer) stepsContainer.style.display = 'block';
      if (resourcesContainer) resourcesContainer.style.display = 'none';
    }
    
    // Allow time for DOM updates
    setTimeout(resolve, 50);
  });
}

/**
 * Create floating action button
 * @returns {Promise<HTMLElement>}
 */
export async function createFAB() {
  // Create FAB element
  const fab = document.createElement('div');
  fab.className = 'duels-fab';
  fab.innerHTML = '⚔️'; // Swords emoji
  fab.title = 'Guide d\'Atelier';
  
  // Add event listener
  fab.addEventListener('click', toggleGuide);
  
  // Add to DOM
  document.body.appendChild(fab);
  
  return fab;
}

/**
 * Function to create a guide for the main page
 * @returns {Promise<HTMLElement>}
 */
export async function createMainPageGuide() {
  // Get active path
  const activePath = getActivePath(workshopPaths, currentSettings);
  
  // Create guide base
  const guide = createGuideBase(activePath, toggleResources, toggleGuide);
  
  // Create steps container
  const stepsContainer = await createStepsContainer(
    'main', 
    activePath, 
    stepsLibrary, 
    currentSettings, 
    false // Don't use accordion style for main page
  );
  
  // Add steps container to guide
  guide.appendChild(stepsContainer);
  
  // Create resources panel (initially hidden)
  const resourcesPanel = await createResourcesPanel(
    commonResources, 
    activePath, 
    stepsLibrary, 
    toggleResources
  );
  
  // Add resources panel to guide
  guide.appendChild(resourcesPanel);
  
  // Add guide to page
  document.body.appendChild(guide);
  
  return guide;
}

/**
 * Function to create a guide for the model selection page
 * @returns {Promise<HTMLElement>}
 */
export async function createModelSelectionGuide() {
  const activePath = getActivePath(workshopPaths, currentSettings);
  const guide = createGuideBase(activePath, toggleResources, toggleGuide);
  
  // Create steps container
  const stepsContainer = await createStepsContainer(
    'model_selection', 
    activePath, 
    stepsLibrary, 
    currentSettings, 
    true, // Use accordion style for model selection page
    ['evaluate_frugality'] // Force these steps to be active by default
  );
  
  guide.appendChild(stepsContainer);
  
  // Create resources panel (initially hidden)
  const resourcesPanel = await createResourcesPanel(
    commonResources, 
    activePath, 
    stepsLibrary, 
    toggleResources
  );
  guide.appendChild(resourcesPanel);
  
  // Add guide to the page
  document.body.appendChild(guide);
  
  return guide;
}

/**
 * Function to create a guide for the duel page
 * @returns {Promise<HTMLElement>}
 */
export async function createDuelGuide() {
  const activePath = getActivePath(workshopPaths, currentSettings);
  const guide = createGuideBase(activePath, toggleResources, toggleGuide);
  
  // Create steps container
  const stepsContainer = await createStepsContainer(
    'duel', 
    activePath, 
    stepsLibrary, 
    currentSettings, 
    true, // Use accordion style for duel page
    ['choose_prompt', 'evaluate_frugality'] // Force these steps to be active by default
  );
  
  guide.appendChild(stepsContainer);
  
  // Create resources panel (initially hidden)
  const resourcesPanel = await createResourcesPanel(
    commonResources, 
    activePath, 
    stepsLibrary, 
    toggleResources
  );
  guide.appendChild(resourcesPanel);
  
  // Add guide to the page
  document.body.appendChild(guide);
  
  return guide;
}

/**
 * Function to create appropriate guide based on detected page
 * @returns {Promise<HTMLElement|null>}
 */
export async function createGuideForCurrentPage() {
  // Check what page we're on
  const pageType = detectPageType();
  
  // Create appropriate guide
  if (pageType === 'main') {
    return await createMainPageGuide();
  } else if (pageType === 'model_selection') {
    return await createModelSelectionGuide();
  } else if (pageType === 'duel') {
    return await createDuelGuide();
  }
  
  return null;
}

/**
 * Function to apply consistent styling to all resource buttons
 * @returns {Promise<void>}
 */
export async function applyResourceButtonStyles() {
  return new Promise(resolve => {
    // Get all resource buttons
    const resourceButtons = document.querySelectorAll('.duels-resource-button');
    
    // Apply styling to each button
    resourceButtons.forEach(button => {
      button.setAttribute('style', 'background-color: white !important; color: #222 !important; border: 2px solid #9898F8 !important; box-shadow: none !important; outline: none !important; text-decoration: none !important;');
      
      // Also remove any hover effects by adding event listeners
      button.addEventListener('mouseenter', (e) => {
        e.target.style.backgroundColor = 'white';
        e.target.style.color = '#222';
        e.target.style.boxShadow = 'none';
        e.target.style.outline = 'none';
        e.target.style.textDecoration = 'none';
        e.target.style.transform = 'none';
      });
    });
    
    // Resolve after a short delay to ensure styles are applied
    setTimeout(resolve, 50);
  });
}

/**
 * Function to adapt the content size for better UI
 * @returns {Promise<void>}
 */
export async function adaptContentSize() {
  return new Promise(resolve => {
    try {
      // Adjust resource buttons in choose_prompt step
      const resourceButtons = document.querySelectorAll('.duels-resource-button');
      resourceButtons.forEach(button => {
        if (button.clientWidth < button.scrollWidth) {
          // Content is being cut off, make font smaller
          button.style.fontSize = '0.55rem';
          button.style.padding = '2px 3px';
          button.style.lineHeight = '1';
        }
      });
      
      // Extra handling for personas and prompts
      const personas = document.querySelectorAll('.duels-persona');
      personas.forEach(persona => {
        if (persona.clientWidth < persona.scrollWidth) {
          persona.style.fontSize = '0.7rem';
        }
      });
      
      resolve();
    } catch (error) {
      console.error('Error adapting content size:', error);
      resolve(); // Resolve anyway to prevent hanging
    }
  });
}

/**
 * Initialize guide with URL observer for navigation
 * @returns {Promise<void>}
 */
export async function initializeGuide() {
  try {
    // Load Font Awesome for icons
    await loadFontAwesome();

    // Create the FAB
    await createFAB();
    
    // Create guide for current page
    await createGuideForCurrentPage();
    
    // Apply resource button styles and adapt content
    await new Promise(resolve => setTimeout(resolve, 500));
    await Promise.all([
      applyResourceButtonStyles(),
      adaptContentSize()
    ]);
    
    // Setup URL change detection
    setupURLChangeDetection();
    
    // Setup style observer
    setupStyleObserver();
    
  } catch (error) {
    console.error('Error initializing guide:', error);
  }
}

/**
 * Setup URL change detection
 */
function setupURLChangeDetection() {
  // Track current URL
  let lastUrl = window.location.href;
  
  // Create a MutationObserver to watch for URL changes
  const observer = new MutationObserver(async () => {
    // Check for URL changes
    if (lastUrl !== window.location.href) {
      lastUrl = window.location.href;
      
      // Remove existing guide
      const existingGuide = document.getElementById('duels-guide');
      if (existingGuide) {
        existingGuide.remove();
      }
      
      // Create appropriate guide
      await createGuideForCurrentPage();
      
      // Apply resource button styles
      await new Promise(resolve => setTimeout(resolve, 500));
      await applyResourceButtonStyles();
    }
  });
  
  // Start observing
  observer.observe(document, { subtree: true, childList: true });
}

/**
 * Setup style observer for dynamic styling
 */
function setupStyleObserver() {
  // Observer for resource button styling
  const styleObserver = new MutationObserver(async () => {
    // Small delay to ensure DOM is updated
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Apply styles and adapt content
    await Promise.all([
      applyResourceButtonStyles(),
      adaptContentSize()
    ]);
  });
  
  // Observe DOM for changes
  styleObserver.observe(document.body, { 
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
}

/**
 * Load Font Awesome for icons
 * @returns {Promise<void>}
 */
async function loadFontAwesome() {
  return new Promise(resolve => {
    if (!document.getElementById('fontawesome-css')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.id = 'fontawesome-css';
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      
      // Resolve when the font is loaded
      fontAwesome.onload = () => resolve();
      
      document.head.appendChild(fontAwesome);
    } else {
      // Font already loaded
      resolve();
    }
  });
}