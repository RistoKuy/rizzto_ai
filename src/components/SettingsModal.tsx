'use client';

import { useSettings, ChatSettings } from '@/hooks/useSettings';
import { useState, useEffect } from 'react';

export default function SettingsModal() {
  const { settings, updateSettings, resetSettings, isOpen, toggleSettings } = useSettings();
  
  // Local state to track form values
  const [formValues, setFormValues] = useState<ChatSettings>(settings);
  
  // Update local form values when settings change
  useEffect(() => {
    setFormValues(settings);
  }, [settings]);
  
  // Update local form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number' || type === 'range') {
      setFormValues({
        ...formValues,
        [name]: parseFloat(value),
      });
    } else {
      setFormValues({
        ...formValues,
        [name]: value,
      });
    }
  };
  
  // Form validation
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Save settings
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formValues.proxyUrl || !formValues.model) {
      setValidationError('API Endpoint URL and Model are required fields');
      return;
    }
    
    // Clear validation error
    setValidationError(null);
    
    // Save settings and close modal
    updateSettings(formValues);
    toggleSettings();
  };
  
  // Reset form values when modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormValues(settings);
    }
  }, [isOpen, settings]);
  
  // Use useState and useEffect for animation
  const [isVisible, setIsVisible] = useState(false);
  
  // Handle animation timing
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);
  
  // Handle exit animation
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      toggleSettings();
    }, 300); // Match the animation duration
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-50 ${isVisible ? 'fade-in' : 'opacity-0'}`}
      onClick={handleClose}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div 
        className={`fixed top-0 bottom-0 right-0 w-full max-w-md bg-white dark:bg-gray-800/95 shadow-xl ${isVisible ? 'slide-in' : 'translate-x-full'} flex flex-col`}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking the panel
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-white text-xl font-medium">Chat Settings</h2>
          <button 
            onClick={handleClose}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Close settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable form content */}
        <div className="flex-1 overflow-y-auto">
          <form id="settings-form" onSubmit={handleSave} className="p-6 space-y-6">
          {/* Essential Settings Section */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
            Required Settings
          </h3>

          {/* API Endpoint URL */}
          <div>
            <label htmlFor="proxyUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Endpoint URL
            </label>
            <input
              type="text"
              id="proxyUrl"
              name="proxyUrl"
              value={formValues.proxyUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="https://openrouter.ai/api/v1/chat/completions"
            />
          </div>
          
          {/* Model Selection - Custom Input */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              AI Model 
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (Format: provider/model-name)
              </span>
            </label>
            <input
              type="text"
              id="model"
              name="model"
              value={formValues.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="e.g., openai/gpt-4, anthropic/claude-3-opus, or any custom model"
            />
          </div>
          
          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              API Key 
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (Stored in browser only, not sent to our server)
              </span>
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={formValues.apiKey || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Your API key (optional if using environment variables)"
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This will override the server-side API key. Leave blank to use the server-configured key.
            </p>
          </div>
          
          {/* Advanced Settings Section */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mt-8">
            Advanced Settings
          </h3>
          
          {/* System Prompt */}
          <div>
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              System Prompt
            </label>
            <textarea
              id="systemPrompt"
              name="systemPrompt"
              value={formValues.systemPrompt}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-blue-500 dark:focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Instructions for the AI assistant..."
            />
          </div>

          {/* Context Window */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Context Window
              </label>
              <button 
                type="button"
                onClick={() => setFormValues({
                  ...formValues, 
                  contextWindow: formValues.contextMode === 'messages' ? 10 : 4000,
                  contextMode: formValues.contextMode || 'messages'
                })}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Reset
              </button>
            </div>
            
            {/* Toggle between Messages and Tokens */}
            <div className="flex items-center space-x-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contextMode"
                  value="messages"
                  checked={formValues.contextMode === 'messages' || !formValues.contextMode}
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      contextMode: e.target.value as 'messages',
                      contextWindow: 10 // Reset to appropriate default
                    });
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">By Messages</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="contextMode"
                  value="tokens"
                  checked={formValues.contextMode === 'tokens'}
                  onChange={(e) => {
                    setFormValues({
                      ...formValues,
                      contextMode: e.target.value as 'tokens',
                      contextWindow: 4000 // Reset to appropriate default
                    });
                  }}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">By Tokens</span>
              </label>
            </div>
            
            {/* Context Window Value Display */}
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {formValues.contextMode === 'tokens' ? 
                  `${formValues.contextWindow ?? 4000} tokens` : 
                  `${formValues.contextWindow ?? 10} messages`
                }
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                {formValues.contextMode === 'tokens' ? 
                  '(How many tokens of previous conversation to include)' :
                  '(How many previous messages to remember)'
                }
              </span>
            </div>
            
            {/* Slider */}
            <input
              type="range"
              id="contextWindow"
              name="contextWindow"
              min={formValues.contextMode === 'tokens' ? 100 : 1}
              max={formValues.contextMode === 'tokens' ? 128000 : 50}
              step={formValues.contextMode === 'tokens' ? 100 : 1}
              value={formValues.contextWindow ?? (formValues.contextMode === 'tokens' ? 4000 : 10)}
              onChange={(e) => {
                setFormValues({
                  ...formValues, 
                  contextWindow: parseInt(e.target.value)
                });
              }}
              className="w-full"
            />
            
            {/* Range Labels */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {formValues.contextMode === 'tokens' ? (
                <>
                  <span>100</span>
                  <span>64K</span>
                  <span>128K</span>
                </>
              ) : (
                <>
                  <span>1</span>
                  <span>25</span>
                  <span>50</span>
                </>
              )}
            </div>
            
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {formValues.contextMode === 'tokens' ? 
                'Higher token counts provide more context but increase API costs. Most models support up to 128K tokens.' :
                'Higher message counts give the AI more context but use more tokens. Lower values help maintain focus on recent messages.'
              }
            </p>
          </div>
          
          {/* Generation Settings Section */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mt-8">
            Generation Settings
          </h3>
          
          {/* Temperature Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Temperature: {formValues.temperature !== undefined ? formValues.temperature.toFixed(1) : 'Not set'} 
                <span className="text-xs text-gray-500 dark:text-gray-400"> (lower = more focused, higher = more creative)</span>
              </label>
              <button 
                type="button"
                onClick={() => setFormValues({...formValues, temperature: undefined})}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <input
              type="range"
              id="temperature"
              name="temperature"
              min="0"
              max="2"
              step="0.1"
              value={formValues.temperature ?? 1.0} // Default slider position if undefined
              onChange={(e) => {
                setFormValues({
                  ...formValues, 
                  temperature: parseFloat(e.target.value)
                });
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.0</span>
              <span>1.0</span>
              <span>2.0</span>
            </div>
          </div>
          
          {/* Max Tokens */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="maxTokens" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Max Tokens: {
                  formValues.maxTokens === undefined ? 'Not set' : 
                  formValues.maxTokens === 0 ? 'Unlimited' : 
                  formValues.maxTokens
                }
              </label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setFormValues({...formValues, maxTokens: 0})}
                  className="text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Set Unlimited
                </button>
                <button 
                  type="button"
                  onClick={() => setFormValues({...formValues, maxTokens: undefined})}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
            </div>
            <input
              type="range"
              id="maxTokens"
              name="maxTokens"
              min="0"
              max="4000"
              step="100"
              value={formValues.maxTokens ?? 1000} // Default slider position if undefined
              onChange={(e) => {
                setFormValues({
                  ...formValues, 
                  maxTokens: parseInt(e.target.value)
                });
              }}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0 (Unlimited)</span>
              <span>2000</span>
              <span>4000</span>
            </div>
          </div>
          
          {/* Validation Error */}
          {validationError && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
              {validationError}
            </div>
          )}
          </form>
        </div>
        
        {/* Action Buttons - Fixed to bottom of panel */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center shadow-md">
          <div>
            <button
              type="button"
              onClick={resetSettings}
              className="min-w-[80px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="min-w-[80px] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              form="settings-form"
              className="min-w-[80px] px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-md shadow-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
