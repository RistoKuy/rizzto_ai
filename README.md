# Risto's AI Chatbot

A modern, fully customizable AI chatbot built with Next.js, TypeScript, and configurable AI APIs. Features a beautiful gradient UI with sliding settings panel, flexible API configuration, and advanced conversation management.

## ✨ Features

### 🤖 **AI Integration**
- **Universal API Support:** Works with OpenRouter, OpenAI, Anthropic, or any OpenAI-compatible API
- **Custom Model Selection:** Enter any model name (e.g., `openai/gpt-4`, `anthropic/claude-3-opus`)
- **Flexible API Keys:** Use server-side environment variables or client-side custom keys
- **Smart Context Management:** Choose between message-based (1-50) or token-based (100-128K) context windows
- **Real-time Streaming:** See AI responses generate in real-time with streaming text

### 🎨 **Modern UI/UX**
- **Glassmorphism Design:** Beautiful gradient UI with backdrop blur effects
- **Sliding Settings Panel:** Smooth animations with organized settings sections
- **Dark Theme Optimized:** Consistent styling across light and dark modes
- **Responsive Design:** Fully optimized for desktop and mobile devices
- **Real-time Indicators:** Streaming text animation and typing indicators
- **Interactive Controls:** Stop generation button and message regeneration

### ⚙️ **Advanced Configuration**
- **Required Settings:** API endpoint URL, model selection, and optional API key
- **Advanced Settings:** Custom system prompts and intelligent context management
- **Generation Controls:** Temperature (0.0-2.0) and max tokens (including unlimited option)
- **Persistent Storage:** All settings saved in browser localStorage
- **Smart Validation:** Form validation with helpful error messages

### 🧠 **Conversation Management**
- **Markdown Support:** Rich text rendering with syntax highlighting
- **Auto-scroll:** Smart scrolling to keep conversations flowing
- **Context Modes:** Switch between message count or token count for context
- **Memory Optimization:** Intelligent conversation history management
- **Keyboard Shortcuts:** Enter to send, Shift+Enter for new lines
- **Streaming Response:** Real-time text generation with visual feedback

## 🚀 Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd rizzto_ai
   npm install
   ```

2. **Set up environment variables (optional):**
   - Copy `.env.example` to `.env.local`
   - Get your API key from [OpenRouter](https://openrouter.ai/keys) or your preferred AI provider
   - Replace `your_openrouter_api_key_here` with your actual API key
   - **Note:** You can also configure API keys directly in the app settings

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Configure your chatbot:**
   - Open [http://localhost:3000](http://localhost:3000)
   - The settings panel will open automatically on first visit
   - Configure your API endpoint, model, and preferences
   - Start chatting!

## 🔧 Configuration Options

### Essential Settings
- **API Endpoint URL:** The base URL for your AI API (e.g., `https://openrouter.ai/api/v1/chat/completions`)
- **AI Model:** Model identifier in `provider/model-name` format (e.g., `openai/gpt-4-turbo`)
- **API Key:** Your API key (stored securely in browser only)

### Advanced Settings  
- **System Prompt:** Custom instructions for the AI assistant
- **Context Window:** Choose between:
  - **Messages mode:** 1-50 previous messages
  - **Tokens mode:** 100-128,000 tokens for precise control

### Generation Settings
- **Temperature:** 0.0 (focused) to 2.0 (creative)
- **Max Tokens:** Response length limit or unlimited (0)

## 🔑 Environment Variables

Create a `.env.local` file in the root directory (optional - you can also configure in the app):

```env
# Optional: Server-side API key (can be overridden in app settings)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Your site URL for API referrer header
YOUR_SITE_URL=http://localhost:3000
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router and Turbopack
- **Language:** TypeScript with strict type checking
- **Styling:** Tailwind CSS 4 with custom components and animations
- **UI Components:** Custom-built with Tailwind utilities and glassmorphism effects
- **Typography:** @tailwindcss/typography for rich markdown rendering
- **AI Integration:** Universal API support (OpenRouter, OpenAI, Anthropic, etc.)
- **Markdown:** marked library for rich text parsing and rendering
- **State Management:** React Context API for settings and UI state
- **Storage:** Browser localStorage for persistent settings

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # Universal chat API endpoint
│   ├── globals.css              # Global styles and animations
│   ├── layout.tsx              # Root layout with dark theme
│   └── page.tsx                # Main chat interface
├── components/
│   ├── ClientLayout.tsx        # Client-side context provider
│   ├── SettingsInfo.tsx        # Settings status indicator
│   └── SettingsModal.tsx       # Sliding settings panel
├── contexts/
│   └── SettingsContext.tsx     # Settings state management
└── hooks/
    └── useSettings.ts          # Settings hook and types
```

## 🎯 Features in Detail

### Chat Interface
- **Modern Design:** Clean message bubbles with gradient styling
- **Auto-scroll:** Automatic scrolling to newest messages
- **Streaming Responses:** Real-time text generation with visual typing indicators
- **Thinking Mode:** Support for models with "thinking" capabilities (like Claude)
- **Generation Control:** Stop button to cancel ongoing generations
- **Message Regeneration:** One-click retry button to regenerate any response
- **Keyboard Shortcuts:** Enter to send, Shift+Enter for line breaks
- **Responsive Layout:** Optimized for all screen sizes

### Settings System
- **Sliding Panel:** Smooth right-to-left animation with backdrop blur
- **Organized Sections:** Required, Advanced, and Generation settings
- **Form Validation:** Real-time validation with helpful error messages
- **Persistent Storage:** Settings automatically saved to localStorage
- **Reset Functionality:** Quick reset to default values

### AI Integration
- **Universal Compatibility:** Works with any OpenAI-compatible API
- **Model Flexibility:** Support for any AI model with proper endpoint
- **Thinking Detection:** Smart handling for models with thinking capabilities
- **Context Management:** Intelligent conversation history handling
- **Error Handling:** Graceful error handling with user feedback
- **Token Optimization:** Smart token counting and management

### Customization Options
- **System Prompts:** Define AI personality and behavior
- **Context Strategies:** Choose optimal context management approach
- **Generation Control:** Fine-tune AI response characteristics
- **API Configuration:** Full control over API endpoints and authentication

## 🎨 Customization

### AI Behavior
Configure the AI's personality and behavior through the settings panel:
- **System Prompt:** Define the AI's role, personality, and response style
- **Temperature:** Control creativity vs. consistency in responses
- **Context Management:** Optimize for your conversation style
- **Thinking Mode:** Enable for models like Claude that support hidden thinking processes

### API Configuration
The chatbot supports multiple AI providers:
```typescript
// OpenRouter
API URL: https://openrouter.ai/api/v1/chat/completions
Model: openai/gpt-4-turbo

// OpenAI Direct
API URL: https://api.openai.com/v1/chat/completions  
Model: gpt-4-turbo

// Anthropic (via proxy)
API URL: https://api.anthropic.com/v1/messages
Model: claude-3-opus-20240229
```

### Styling
The app uses Tailwind CSS with custom animations:
- Modify `globals.css` for global styles
- Update component classes for UI changes
- Customize animations in the CSS file

## 🚀 Deployment

The app can be deployed to any platform that supports Next.js:

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel with automatic GitHub integration
```

### Docker
```dockerfile
# Use the official Node.js image
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Other Platforms
- **Netlify:** Build command: `npm run build`, Publish directory: `.next`
- **Railway:** Connect GitHub repo with automatic deployments
- **DigitalOcean:** Use App Platform with Node.js buildpack

## 🔧 Development

### Available Scripts
```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production  
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project as a starting point for your own AI chatbot!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- UI inspiration from modern design systems
- AI integration powered by universal API compatibility
- Typography rendering with [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin)

## 📚 Learn More

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub repository](https://github.com/vercel/next.js) - Feedback and contributions welcome

### AI API Resources
- [OpenRouter Documentation](https://openrouter.ai/docs) - Multi-model AI API
- [OpenAI API Reference](https://platform.openai.com/docs) - Official OpenAI API docs
- [Anthropic API Docs](https://docs.anthropic.com/) - Claude API documentation

### Deployment
- [Deploy on Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) - Easiest Next.js deployment
- [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) - Comprehensive deployment guide

---

**Built with ❤️ using Next.js 15, TypeScript, and Tailwind CSS**
