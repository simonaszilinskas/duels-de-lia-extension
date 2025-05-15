// config.js - Configuration loader and data for the extension

import { loadConfig } from './config-loader.js';

// Placeholder objects with default values until configs are loaded
export let workshopPaths = {};
export let stepsLibrary = {};
export let commonResources = {};
export let defaultSettings = {
  activePath: "duels",
  showCompletedSteps: true,
  currentStep: 1
};

/**
 * Initialize all configuration objects by loading from JSON files
 * @returns {Promise<boolean>} True if all configs loaded successfully
 */
export async function initializeConfigs() {
  try {
    // Load all configuration files in parallel
    const [
      loadedWorkshopPaths, 
      loadedStepsLibrary, 
      loadedCommonResources, 
      loadedDefaultSettings
    ] = await Promise.all([
      loadConfig('workshop-paths'),
      loadConfig('steps-library'),
      loadConfig('common-resources'),
      loadConfig('default-settings')
    ]);
    
    // Update the exported objects with loaded data
    workshopPaths = loadedWorkshopPaths;
    stepsLibrary = loadedStepsLibrary;
    commonResources = loadedCommonResources;
    defaultSettings = loadedDefaultSettings || defaultSettings;
    
    console.log('All configurations loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading configurations:', error);
    return false;
  }
}

// Auto-initialize on import
initializeConfigs().catch(error => {
  console.error('Failed to initialize configurations:', error);
});