# Risto's AI Chatbot

A modern, responsive AI chatbot built with Next.js, TypeScript, and the OpenRouter API. Features a beautiful gradient UI with dark/light theme toggle and real-time chat interface.

## Features

- 🤖 AI-powered conversation using OpenRouter API
- 🎨 Beautiful gradient UI with glassmorphism effects
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- ⚡ Real-time messaging with loading indicators
- 📝 Markdown support for rich text responses
- 🔄 Smooth animations and transitions

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local`
   - Get your API key from [OpenRouter](https://openrouter.ai/keys)
   - Replace `your_openrouter_api_key_here` with your actual API key

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** to see the chatbot

## Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
YOUR_SITE_URL=http://localhost:3000
```

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom components
- **UI Components:** Custom-built with Tailwind utilities
- **Typography:** @tailwindcss/typography for markdown rendering
- **AI API:** OpenRouter (supports multiple AI models)
- **Markdown:** marked library for rich text rendering

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # API endpoint for chat
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout with theme toggle
│   └── page.tsx             # Main chat interface
```

## Features in Detail

### Chat Interface
- Clean, modern design with message bubbles
- Auto-scroll to newest messages
- Loading indicators during AI response
- Keyboard shortcuts (Enter to send)

### Theme System
- Toggle between light and dark modes
- Smooth transitions between themes
- Persistent theme state during session

### AI Integration
- Uses OpenRouter API for flexible model selection
- Configurable system prompts
- Error handling and fallbacks
- Rate limiting protection

## Customization

You can customize the AI behavior by editing the system prompt in `src/app/api/chat/route.ts`:

```typescript
{
  role: 'system',
  content: 'Your custom system prompt here...'
}
```

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel:** Connect your GitHub repo for automatic deployments
- **Netlify:** Build command: `npm run build`, Publish directory: `.next`
- **Docker:** Use the included Dockerfile for containerized deployment

## License

MIT License - feel free to use this project as a starting point for your own AI chatbot!

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
