/**
 * config-loader.js - Module to load configuration files
 */

/**
 * Load a configuration file
 * @param {string} configName - Name of the config file without extension
 * @returns {Promise<Object>} - The loaded configuration object
 */
export async function loadConfig(configName) {
  try {
    const url = chrome.runtime.getURL(`config/${configName}.json`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to load config: ${configName}.json`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error loading config ${configName}:`, error);
    return {};
  }
}

/**
 * Load all required configuration files
 * @returns {Promise<Object>} - Object containing all configurations
 */
export async function loadAllConfigs() {
  try {
    const [workshopPaths, stepsLibrary, commonResources, defaultSettings] = await Promise.all([
      loadConfig('workshop-paths'),
      loadConfig('steps-library'),
      loadConfig('common-resources'),
      loadConfig('default-settings')
    ]);
    
    return {
      workshopPaths,
      stepsLibrary,
      commonResources,
      defaultSettings
    };
  } catch (error) {
    console.error('Error loading configurations:', error);
    return {
      workshopPaths: {},
      stepsLibrary: {},
      commonResources: {},
      defaultSettings: {}
    };
  }
}