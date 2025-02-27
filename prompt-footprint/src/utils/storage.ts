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
  const today = getTodayString();
  const result = await chrome.storage.local.get(today);
  
  if (result[today]) {
    return result[today] as DailyPromptData;
  }
  
  // Initialize new data for today
  const newData: DailyPromptData = {
    date: today,
    prompts: {},
    totalCount: 0
  };
  
  await chrome.storage.local.set({ [today]: newData });
  return newData;
}

// Log a new prompt
export async function logPrompt(aiService: string): Promise<void> {
  const todayData = await getTodayData();
  
  // Increment count for this AI service
  if (!todayData.prompts[aiService]) {
    todayData.prompts[aiService] = 0;
  }
  todayData.prompts[aiService]++;
  todayData.totalCount++;
  
  // Save updated data
  await chrome.storage.local.set({ [todayData.date]: todayData });
}

// Get data for the last N days
export async function getHistoricalData(days: number = 7): Promise<DailyPromptData[]> {
  const dates: string[] = [];
  const today = new Date();
  
  // Generate date strings for the last 'days' days
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    dates.push(dateString);
  }
  
  // Fetch data for all dates
  const result = await chrome.storage.local.get(dates);
  
  // Process and sort the data
  return dates
    .map(date => {
      if (result[date]) {
        return result[date] as DailyPromptData;
      } else {
        // Return empty data for days with no records
        return {
          date,
          prompts: {},
          totalCount: 0
        };
      }
    })
    .reverse(); // Return in chronological order
}

// Clear all stored data
export async function clearAllData(): Promise<void> {
  await chrome.storage.local.clear();
}