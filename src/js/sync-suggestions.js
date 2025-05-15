#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// File paths
const commonResourcesPath = path.join(__dirname, '..', 'config', 'common-resources.json');
const stepsLibraryPath = path.join(__dirname, '..', 'config', 'steps-library.json');

// Read config files
try {
  console.log('Reading configuration files...');
  const commonResources = JSON.parse(fs.readFileSync(commonResourcesPath, 'utf8'));
  const stepsLibrary = JSON.parse(fs.readFileSync(stepsLibraryPath, 'utf8'));

  // Extract categories and suggestions from common-resources.json
  const categories = commonResources.promptSuggestionCategories || [];
  
  // Create a flat list of all suggestions
  const allSuggestions = [];
  categories.forEach(category => {
    if (category.suggestions && Array.isArray(category.suggestions)) {
      allSuggestions.push(...category.suggestions);
    }
  });

  // Update steps-library.json with categories and suggestions
  if (stepsLibrary.choose_prompt) {
    console.log('Updating steps-library.json with categories and suggestions...');
    stepsLibrary.choose_prompt.suggestionCategories = categories;
    stepsLibrary.choose_prompt.suggestions = allSuggestions;
  }

  // Also update the flat list in common-resources.json for backward compatibility
  console.log('Updating common-resources.json with flat suggestions list...');
  commonResources.promptSuggestions = allSuggestions;

  // Write the updated files
  fs.writeFileSync(commonResourcesPath, JSON.stringify(commonResources, null, 2), 'utf8');
  fs.writeFileSync(stepsLibraryPath, JSON.stringify(stepsLibrary, null, 2), 'utf8');

  console.log('Suggestions successfully synced between files!');
  console.log(`- Updated ${categories.length} categories`);
  console.log(`- Synced ${allSuggestions.length} suggestions`);
} catch (error) {
  console.error('Error syncing suggestions:', error.message);
  process.exit(1);
}