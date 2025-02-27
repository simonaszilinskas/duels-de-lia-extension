# Testing Prompt Footprint Extension

## Prerequisites

- Node.js version 18.0.0 or higher
- npm or yarn

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Loading the extension in Chrome

1. After running `npm run dev`, Webpack will build the extension to the `dist` directory
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `dist` directory
5. The extension should now be installed and you should see the Prompt Footprint icon in your browser toolbar

## Testing

1. Visit any of the supported AI chatbot websites:
   - ChatGPT (chat.openai.com)
   - Claude (claude.ai)
   - Google Bard/Gemini
   - Microsoft Bing AI
   - Perplexity.ai

2. Send a few prompts to these services

3. Click on the Prompt Footprint extension icon in your browser toolbar to see:
   - Today's prompt count
   - Estimated carbon footprint
   - Service breakdown
   - Weekly usage chart

## Known Issues

- You may need to reload the extension after installing if it doesn't immediately track prompts
- Some AI services may change their DOM structure, which could break prompt detection

## Building for Production

When you're ready to create a production build:

```bash
npm run build
```

This will create a production-ready extension in the `dist` directory.