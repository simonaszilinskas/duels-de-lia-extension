// Global functions accessible from window object

// Add a prompt counter reset function that will be globally available
// This allows users to reset the counter from the console
window.resetPromptCounter = function() {
  try {
    chrome.storage.local.clear((result) => {
      if (chrome.runtime.lastError) {
        console.error('[Prompt Footprint] Error clearing storage:', chrome.runtime.lastError);
        return "Error: " + chrome.runtime.lastError.message;
      }
      console.log('[Prompt Footprint] Storage has been cleared');
      return "Storage cleared, counter reset";
    });
  } catch (error) {
    console.error('[Prompt Footprint] Exception clearing storage:', error);
    return "Error clearing storage: " + error;
  }
};

// Add a function to manually increment the counter
window.incrementPromptCounter = function(service = "claude") {
  try {
    chrome.runtime.sendMessage({
      type: "PROMPT_DETECTED",
      aiService: service
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[Prompt Footprint] Error sending message:', chrome.runtime.lastError);
        return "Error: " + chrome.runtime.lastError.message;
      }
      console.log('[Prompt Footprint] Manual count increment response:', response);
      return "Counter incremented for " + service;
    });
  } catch (error) {
    console.error('[Prompt Footprint] Exception incrementing counter:', error);
    return "Error incrementing counter: " + error;
  }
};

// Add a function to show current counter data
window.showPromptCounter = function() {
  try {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    chrome.storage.local.get([dateString], (result) => {
      if (chrome.runtime.lastError) {
        console.error('[Prompt Footprint] Error getting storage:', chrome.runtime.lastError);
        return "Error: " + chrome.runtime.lastError.message;
      }
      console.log(`[Prompt Footprint] Current data for today (${dateString}):`, result);
      return result;
    });
  } catch (error) {
    console.error('[Prompt Footprint] Exception getting counter data:', error);
    return "Error getting counter data: " + error;
  }
};

console.log('[Prompt Footprint] Global functions initialized');
console.log('[Prompt Footprint] You can use these commands in the console:');
console.log('   resetPromptCounter() - Reset the counter');
console.log('   incrementPromptCounter() - Manually increment the counter');
console.log('   showPromptCounter() - Show current counter data');