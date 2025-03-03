import { detectAIService } from "../utils/carbonCalculation";
import { logPrompt, getTodayData } from "../utils/storage";

// Track URL changes to detect when a user is on an AI chat service
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const aiService = detectAIService(tab.url);
    console.log(`[Prompt Footprint Background] Tab updated: ${tab.url}, service: ${aiService}`);
    
    if (aiService !== 'other') {
      // User is on a supported AI service, setup monitoring for this tab
      console.log(`[Prompt Footprint Background] Injecting script for ${aiService}`);
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["aiMonitor.js"]
      }).then(() => {
        console.log(`[Prompt Footprint Background] Script injected successfully`);
      }).catch(err => {
        console.error(`[Prompt Footprint Background] Failed to inject monitor script:`, err);
      });
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Prompt Footprint Background] Message received:', message);
  
  if (message.type === "PROMPT_DETECTED") {
    const aiService = message.aiService;
    console.log(`[Prompt Footprint Background] Detected prompt for ${aiService}`);
    
    // Log the prompt
    logPrompt(aiService).then(() => {
      console.log(`[Prompt Footprint Background] Prompt logged successfully`);
      // Update the badge count
      updateBadge();
      // Send confirmation back
      sendResponse({ success: true });
    }).catch(err => {
      console.error(`[Prompt Footprint Background] Error logging prompt:`, err);
      sendResponse({ success: false, error: err.message });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

// Update the extension badge with today's prompt count
async function updateBadge() {
  try {
    const todayData = await getTodayData();
    console.log('[Prompt Footprint Background] Today data for badge:', todayData);
    
    // Display the count on the extension badge
    chrome.action.setBadgeText({ 
      text: todayData.totalCount.toString() 
    });
    
    chrome.action.setBadgeBackgroundColor({ color: "#10B981" });
    console.log('[Prompt Footprint Background] Badge updated with count:', todayData.totalCount);
  } catch (error) {
    console.error('[Prompt Footprint Background] Error updating badge:', error);
  }
}

// Initial badge update when extension loads
updateBadge();