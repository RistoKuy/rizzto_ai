import { useContext } from 'react';
import { SettingsContext } from '@/contexts/SettingsContext';

export interface ChatSettings {
  // Essential settings (required)
  proxyUrl: string;        // API endpoint URL
  model: string;           // AI model to use (provider/model-name format)
  apiKey?: string;         // API key (stored only in client-side)
  
  // Advanced settings
  systemPrompt: string;    // Instructions for the AI assistant
  contextWindow?: number;  // Number of previous messages/tokens to include in context
  contextMode?: 'messages' | 'tokens'; // Whether to count by messages or tokens
  
  // Generation settings
  temperature?: number;    // Controls creativity vs. determinism (0.0-2.0)
  maxTokens?: number;      // Maximum response length (0 means unlimited)
  
  // Model capabilities
  supportsThinking?: boolean; // Whether the model supports "thinking" mode
}

export function useSettings() {
  return useContext(SettingsContext);
}
