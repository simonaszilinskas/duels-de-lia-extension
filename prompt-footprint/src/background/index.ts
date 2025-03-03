import { detectAIService } from "../utils/carbonCalculation";
import { logPrompt, getTodayData } from "../utils/storage";

// Track URL changes to detect when a user is on an AI chat service
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const aiService = detectAIService(tab.url);
    if (aiService !== 'other') {
      // User is on a supported AI service, setup monitoring for this tab
      chrome.scripting.executeScript({
        target: { tabId },
        files: ["aiMonitor.js"]
      }).catch(err => console.error("Failed to inject monitor script:", err));
    }
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PROMPT_DETECTED") {
    const aiService = message.aiService;
    // Log the prompt
    logPrompt(aiService).then(() => {
      // Update the badge count
      updateBadge();
      // Send confirmation back
      sendResponse({ success: true });
    });
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});

// Update the extension badge with today's prompt count
async function updateBadge() {
  const todayData = await getTodayData();
  
  // Display the count on the extension badge
  chrome.action.setBadgeText({ 
    text: todayData.totalCount.toString() 
  });
  
  chrome.action.setBadgeBackgroundColor({ color: "#10B981" });
}

// Initial badge update when extension loads
updateBadge();