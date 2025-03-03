export interface DailyPromptData {
  date: string; // YYYY-MM-DD
  prompts: Record<string, number>; // AI service -> count
  totalCount: number;
}

// Get today's date in YYYY-MM-DD format
export function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

// Initialize or get today's data
export async function getTodayData(): Promise<DailyPromptData> {
  try {
    const today = getTodayString();
    console.log(`[Prompt Footprint Storage] Getting data for today: ${today}`);
    
    const result = await chrome.storage.local.get(today);
    console.log(`[Prompt Footprint Storage] Storage result:`, result);
    
    if (result[today]) {
      console.log(`[Prompt Footprint Storage] Found existing data for today`);
      return result[today] as DailyPromptData;
    }
    
    console.log(`[Prompt Footprint Storage] No data found for today, initializing new data`);
    
    // Initialize new data for today
    const newData: DailyPromptData = {
      date: today,
      prompts: {},
      totalCount: 0
    };
    
    await chrome.storage.local.set({ [today]: newData });
    console.log(`[Prompt Footprint Storage] Initialized new data for today:`, newData);
    
    return newData;
  } catch (error) {
    console.error(`[Prompt Footprint Storage] Error getting today's data:`, error);
    throw error;
  }
}

// Log a new prompt
export async function logPrompt(aiService: string): Promise<void> {
  console.log(`[Prompt Footprint Storage] Logging prompt for service: ${aiService}`);
  
  try {
    const todayData = await getTodayData();
    console.log(`[Prompt Footprint Storage] Current data:`, todayData);
    
    // Increment count for this AI service
    if (!todayData.prompts[aiService]) {
      todayData.prompts[aiService] = 0;
    }
    todayData.prompts[aiService]++;
    todayData.totalCount++;
    
    console.log(`[Prompt Footprint Storage] Updated data:`, todayData);
    
    // Save updated data
    await chrome.storage.local.set({ [todayData.date]: todayData });
    console.log(`[Prompt Footprint Storage] Data saved successfully`);
    
    return;
  } catch (error) {
    console.error(`[Prompt Footprint Storage] Error logging prompt:`, error);
    throw error;
  }
}

// Get data for the last N days
export async function getHistoricalData(days: number = 7): Promise<DailyPromptData[]> {
  try {
    console.log(`[Prompt Footprint Storage] Getting historical data for ${days} days`);
    
    const dates: string[] = [];
    const today = new Date();
    
    // Generate date strings for the last 'days' days
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dates.push(dateString);
    }
    
    console.log(`[Prompt Footprint Storage] Generated date strings:`, dates);
    
    // Fetch data for all dates
    const result = await chrome.storage.local.get(dates);
    console.log(`[Prompt Footprint Storage] Retrieved historical data:`, result);
    
    // Process and sort the data
    const processedData = dates
      .map(date => {
        if (result[date]) {
          console.log(`[Prompt Footprint Storage] Found data for ${date}`);
          return result[date] as DailyPromptData;
        } else {
          console.log(`[Prompt Footprint Storage] No data for ${date}, creating empty record`);
          // Return empty data for days with no records
          return {
            date,
            prompts: {},
            totalCount: 0
          };
        }
      })
      .reverse(); // Return in chronological order
    
    console.log(`[Prompt Footprint Storage] Processed historical data:`, processedData);
    return processedData;
  } catch (error) {
    console.error(`[Prompt Footprint Storage] Error getting historical data:`, error);
    // Return empty array as fallback
    return [];
  }
}

// Clear all stored data
export async function clearAllData(): Promise<void> {
  await chrome.storage.local.clear();
}