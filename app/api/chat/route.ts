import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-pro'),
    messages: messages, // Passing directly fixes the "convertToCoreMessages" error
    system: `You are NEXORA AI, Lead Architect for YashNav IT Solutions. Use the master manual for all coding and SEO tasks.`,
  });

  return result.toDataStreamResponse();
}