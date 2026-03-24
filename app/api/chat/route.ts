import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-pro'), 
    messages,
    system: `You are NEXORA AI, a world-class AI assistant similar to ChatGPT and Claude. 
    You are the Lead Architect for YashNav IT Solutions. 
    You can write code, design UI, create SEO strategies, and solve complex problems. 
    Always provide expert-level, accurate, and detailed responses.`,
  });

  return result.toTextStreamResponse();
}