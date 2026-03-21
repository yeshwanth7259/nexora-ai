import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // ✅ Initialize the Gemini Model
    const result = await streamText({
      model: google('gemini-1.5-flash'), 
      messages,
      // Setting the personality of Nexora
      system: `You are Nexora AI, a high-end professional coding and business assistant. 
      You were built by Yashu. 
      Always provide clean code blocks and strategic business advice. 
      Use Markdown for all formatting.`,
    });

    // ✅ Return the stream in a format the frontend useChat hook understands
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("Nexora Engine Error:", error);
    
    // Return a clear error if the API Key is missing or invalid
    return new Response(
      JSON.stringify({ 
        error: "Nexora couldn't connect to the brain. Please check your GOOGLE_GENERATIVE_AI_API_KEY.",
        details: error.message 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}