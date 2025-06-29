"use client";

import { useSettings } from "@/hooks/useSettings";

export default function SettingsInfo() {
  const { settings, toggleSettings } = useSettings();

  // Check if any essential settings are missing
  const hasEssentialSettings = settings.proxyUrl && settings.model;

  if (!hasEssentialSettings) {
    return (
      <div className="text-xs text-red-500 flex flex-wrap justify-center">
        <button
          onClick={toggleSettings}
          className="underline hover:text-red-600"
        >
          ⚠️ Settings required! Click to configure
        </button>
      </div>
    );
  }

  // Display model name (extract from provider/model format if possible)
  const modelName = settings.model.includes("/")
    ? settings.model.split("/")[1]
    : settings.model;

  // Format max tokens display
  const maxTokensDisplay = settings.maxTokens === undefined ? 'Not set' : 
                           settings.maxTokens === 0 ? 'Unlimited' :
                           settings.maxTokens;
                           
  // Check if using client API key
  const usingClientKey = !!settings.apiKey;
                           
  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap justify-center gap-x-4">
      {/* Essential Settings */}
      <span className="font-medium">Model: {modelName || "Not set"}</span>
      {usingClientKey && <span className="text-green-500">Using custom API key</span>}
      
      {/* Generation Settings */}
      <span>
        {settings.temperature !== undefined
          ? `Temp: ${settings.temperature.toFixed(1)}`
          : ""}
      </span>
      <span>
        {maxTokensDisplay !== 'Not set' 
          ? `Max: ${maxTokensDisplay}` 
          : ""}
      </span>
      
      {/* Advanced Settings */}
      <span>
        Ctx: {settings.contextWindow || 10}
        {settings.contextMode === 'tokens' ? 't' : 'm'}
      </span>
      
      {/* Settings button */}
      <button 
        onClick={toggleSettings}
        className="ml-2 underline hover:text-blue-500 dark:hover:text-blue-400"
      >
        ⚙️
      </button>
    </div>
  );
}
