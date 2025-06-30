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
    const { proxyUrl, model, systemPrompt, temperature, maxTokens, contextWindow, contextMode } = settings;

    // Handle context window limiting based on mode
    let contextMessages = history;
    if (contextMode === 'tokens' && contextWindow) {
      // For token-based limiting, we'll use a rough estimate: ~4 characters per token
      // This is simplified - in production, you'd want to use a proper tokenizer
      const estimatedTokensPerChar = 0.25;
      let totalTokens = 0;
      const limitedMessages = [];
      
      // Count tokens from most recent messages backwards
      for (let i = history.length - 1; i >= 0; i--) {
        const messageTokens = Math.ceil(history[i].content.length * estimatedTokensPerChar);
        if (totalTokens + messageTokens > contextWindow) {
          break;
        }
        totalTokens += messageTokens;
        limitedMessages.unshift(history[i]);
      }
      contextMessages = limitedMessages;
    } else if (contextMode === 'messages' && contextWindow) {
      // For message-based limiting, just take the last N messages
      contextMessages = history.slice(-contextWindow);
    }

    // Make request to OpenRouter API (or custom endpoint) with streaming
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
          
          // Previous conversation history (limited by context window)
          ...contextMessages,
          
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
        stream: true, // Enable streaming
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

    // Create a readable stream to forward the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    // Forward the content chunk to the client
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch {
                  // Skip invalid JSON lines
                  continue;
                }
              }
            }
          }
        } catch (error) {
          console.error('Stream processing error:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
