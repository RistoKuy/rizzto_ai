import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, settings, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // First try to use client-provided API key, then fall back to environment variable
    const clientApiKey = settings?.apiKey?.trim();
    const serverApiKey = process.env.OPENROUTER_API_KEY;
    
    // Use client API key if provided, otherwise use server API key
    const apiKey = clientApiKey || serverApiKey;
    
    if (!apiKey) {
      console.error('API key not found in client settings or environment variables');
      return NextResponse.json(
        { error: 'API configuration error: No API key provided' },
        { status: 500 }
      );
    }
    
    // Use only provided settings, with no defaults
    // If essential settings are missing, return helpful error messages
    if (!settings?.proxyUrl) {
      return NextResponse.json(
        { error: 'API endpoint URL is required. Please configure settings.' },
        { status: 400 }
      );
    }
    
    if (!settings?.model) {
      return NextResponse.json(
        { error: 'AI model is required. Please configure settings.' },
        { status: 400 }
      );
    }
    
    // Extract settings directly from provided settings
    const { proxyUrl, model, systemPrompt, temperature, maxTokens } = settings;

    // Make request to OpenRouter API (or custom endpoint)
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Risto\'s Chatbot',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          // System message (if provided)
          ...(systemPrompt ? [{
            role: 'system',
            content: systemPrompt
          }] : []),
          
          // Previous conversation history based on contextWindow
          ...history,
          
          // Current user message
          {
            role: 'user',
            content: message
          }
        ],
        ...(temperature !== undefined ? { temperature } : {}),
        // Handle "Unlimited" tokens case (0 means no limit)
        ...(maxTokens !== undefined ? 
            maxTokens === 0 ? {} : { max_tokens: maxTokens } 
            : {}),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `Failed to get response from AI service (${response.status})` },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    // Extract the AI's response
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

    return NextResponse.json({ response: aiResponse });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
