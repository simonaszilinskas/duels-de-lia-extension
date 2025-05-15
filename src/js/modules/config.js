/**
 * config.js - Configuration loading with improved error handling and caching
 * Provides a central interface for all configuration needs
 */

import { loadConfig } from './config-loader.js';

// Cache TTL in milliseconds (10 minutes)
const CACHE_TTL = 10 * 60 * 1000;

// Fallback / default configurations
const DEFAULT_CONFIGS = {
  workshopPaths: {
    "duels": {
      id: "duels",
      name: "Les Duels de l'IA",
      description: "Atelier standard: découvrir l'impact environnemental des IA",
      icon: "fas fa-bolt",
      steps: ["choose_prompt", "evaluate_utility", "evaluate_frugality"]
    }
  },
  stepsLibrary: {
    "choose_prompt": {
      id: "choose_prompt",
      order: 1,
      title: "Étape 1 : Lancer une discussion",
      instruction: "Choisissez une question à envoyer aux deux modèles d'IA.",
      pages: ["duel"],
      type: "main"
    },
    "evaluate_utility": {
      id: "evaluate_utility",
      order: 2,
      title: "Étape 2 : Voter",
      instruction: "Examinez les deux réponses et votez pour votre préférée.",
      pages: ["duel"],
      type: "main"
    },
    "evaluate_frugality": {
      id: "evaluate_frugality",
      order: 3,
      title: "Étape 3 : Le jeu en vaut-il la chandelle ?",
      instruction: "Analysez si la différence de qualité entre les deux réponses justifie la différence d'impact environnemental.",
      pages: ["duel"],
      type: "main"
    }
  },
  commonResources: {
    promptSuggestions: [
      "⚙️ Leila, ingénieure en mécanique : Exemple de prompt simple"
    ],
    educationalResources: [
      {
        title: "Ressource par défaut",
        url: "#"
      }
    ]
  },
  defaultSettings: {
    activePath: "duels",
    showCompletedSteps: true,
    currentStep: 1
  }
};

// Configuration cache
const configCache = {
  workshopPaths: {
    data: null,
    timestamp: 0
  },
  stepsLibrary: {
    data: null,
    timestamp: 0
  },
  commonResources: {
    data: null,
    timestamp: 0
  },
  defaultSettings: {
    data: null,
    timestamp: 0
  }
};

// Error tracking
let configErrors = [];

// Exported configuration objects
export let workshopPaths = {};
export let stepsLibrary = {};
export let commonResources = {};
export let defaultSettings = {
  activePath: "duels",
  showCompletedSteps: true,
  currentStep: 1
};

/**
 * Checks if cached data is still valid
 * @param {string} configName - Name of the configuration
 * @returns {boolean} - True if cache is valid
 */
function isCacheValid(configName) {
  const cache = configCache[configName];
  return (
    cache.data !== null && 
    Date.now() - cache.timestamp < CACHE_TTL
  );
}

/**
 * Updates the cache with new data
 * @param {string} configName - Name of the configuration
 * @param {Object} data - The configuration data
 */
function updateCache(configName, data) {
  configCache[configName] = {
    data,
    timestamp: Date.now()
  };
}

/**
 * Gets a configuration, using cache if possible
 * @param {string} configName - Name of the configuration to load
 * @returns {Promise<Object>} - The configuration object
 */
async function getConfig(configName) {
  try {
    // Check if we have valid cached data
    if (isCacheValid(configName)) {
      console.log(`Using cached ${configName} config`);
      return configCache[configName].data;
    }
    
    // Load from JSON file
    console.log(`Loading ${configName} from JSON`);
    const data = await loadConfig(configName);
    
    // Update cache
    updateCache(configName, data);
    
    return data;
  } catch (error) {
    // Record the error
    configErrors.push({
      configName,
      timestamp: Date.now(),
      error: error.message
    });
    
    console.warn(`Failed to load ${configName}, using default:`, error);
    
    // Return fallback configuration
    return DEFAULT_CONFIGS[configName] || {};
  }
}

/**
 * Initialize all configuration objects by loading from JSON files
 * @param {boolean} forceRefresh - Whether to force refresh from files
 * @returns {Promise<boolean>} True if all configs loaded successfully
 */
export async function initializeConfigs(forceRefresh = false) {
  try {
    // Clear cached data if forced refresh
    if (forceRefresh) {
      Object.keys(configCache).forEach(key => {
        configCache[key] = { data: null, timestamp: 0 };
      });
    }
    
    // Reset error tracking
    configErrors = [];
    
    // Load all configuration files in parallel
    const [
      loadedWorkshopPaths, 
      loadedStepsLibrary, 
      loadedCommonResources, 
      loadedDefaultSettings
    ] = await Promise.all([
      getConfig('workshop-paths'),
      getConfig('steps-library'),
      getConfig('common-resources'),
      getConfig('default-settings')
    ]);
    
    // Update the exported objects with loaded data
    workshopPaths = loadedWorkshopPaths;
    stepsLibrary = loadedStepsLibrary;
    commonResources = loadedCommonResources;
    defaultSettings = loadedDefaultSettings || DEFAULT_CONFIGS.defaultSettings;
    
    // Log success or partial success
    if (configErrors.length > 0) {
      console.warn('Some configurations failed to load:', configErrors);
      return false;
    } else {
      console.log('All configurations loaded successfully');
      return true;
    }
  } catch (error) {
    console.error('Fatal error initializing configurations:', error);
    
    // Set fallback values
    workshopPaths = DEFAULT_CONFIGS.workshopPaths;
    stepsLibrary = DEFAULT_CONFIGS.stepsLibrary;
    commonResources = DEFAULT_CONFIGS.commonResources;
    defaultSettings = DEFAULT_CONFIGS.defaultSettings;
    
    return false;
  }
}

/**
 * Gets the current configuration errors
 * @returns {Array} Array of error objects
 */
export function getConfigErrors() {
  return [...configErrors];
}

/**
 * Clears the configuration cache
 * @param {string} [configName] - Specific config to clear, or all if not specified
 */
export function clearConfigCache(configName = null) {
  if (configName && configCache[configName]) {
    configCache[configName] = { data: null, timestamp: 0 };
  } else {
    // Clear all caches
    Object.keys(configCache).forEach(key => {
      configCache[key] = { data: null, timestamp: 0 };
    });
  }
}

// Auto-initialize on import
initializeConfigs().catch(error => {
  console.error('Failed to initialize configurations:', error);
});