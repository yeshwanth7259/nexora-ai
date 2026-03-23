import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-pro'),
    messages, // Direct passing is safer for Vercel builds
    system: `You are NEXORA AI, Lead Architect for YashNav IT Solutions. 
    Execute all coding, design, and SEO tasks with precision.`,
  });

  return result.toDataStreamResponse();
}