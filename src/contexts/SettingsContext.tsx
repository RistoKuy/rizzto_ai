'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { ChatSettings } from '@/hooks/useSettings';

// Initial empty settings structure - used throughout the component
// This defines the default state for settings when nothing is configured

interface SettingsContextType {
  settings: ChatSettings;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  resetSettings: () => void;
  isOpen: boolean;
  toggleSettings: () => void;
}

// Default empty settings context
export const SettingsContext = createContext<SettingsContextType>({
  settings: {
    // Essential settings
    proxyUrl: '',
    model: '',
    apiKey: '',
    
    // Advanced settings
    systemPrompt: '',
    contextWindow: 10,
    contextMode: 'messages',
    
    // Generation settings
    temperature: undefined,
    maxTokens: undefined,
    
    // Model capabilities
    supportsThinking: false,
  },
  updateSettings: () => {},
  resetSettings: () => {},
  isOpen: false,
  toggleSettings: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ChatSettings>({
    // Essential settings
    proxyUrl: '',
    model: '',
    apiKey: '',
    
    // Advanced settings
    systemPrompt: '',
    contextWindow: 10,
    contextMode: 'messages',
    
    // Generation settings
    temperature: undefined,
    maxTokens: undefined,
    
    // Model capabilities
    supportsThinking: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on initial load
  useEffect(() => {
    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('chatSettings') : null;
    
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
        localStorage.removeItem('chatSettings');
      }
    }
  }, []);

  // Check if settings are configured on initial load and open modal if needed
  useEffect(() => {
    // If there are no saved settings or essential settings are missing, open the settings modal
    const hasEssentialSettings = settings.proxyUrl && settings.model;
    if (!hasEssentialSettings) {
      setIsOpen(true);
    }
  }, [settings.proxyUrl, settings.model]);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('chatSettings', JSON.stringify(updatedSettings));
  };

  // Reset settings to empty values
  const resetSettings = () => {
    const defaultValues = {
      // Essential settings
      proxyUrl: '',
      model: '',
      apiKey: '',
      
      // Advanced settings
      systemPrompt: '',
      contextWindow: 10, // Reset to default of 10 messages
      contextMode: 'messages' as const,
      
      // Generation settings
      temperature: undefined,
      maxTokens: undefined,
      
      // Model capabilities
      supportsThinking: false,
    };
    setSettings(defaultValues);
    localStorage.setItem('chatSettings', JSON.stringify(defaultValues));
  };

  // Toggle settings modal
  const toggleSettings = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        isOpen,
        toggleSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
