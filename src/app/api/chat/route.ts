import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    // Make request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.YOUR_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Risto\'s Chatbot',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Risto\'s helpful AI assistant. You are knowledgeable, friendly, and always try to provide accurate and helpful responses. Keep your responses conversational but informative.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
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
