import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-pro'),
    messages, // Direct passing works best in the 2026 SDK
    system: `You are NEXORA AI, the lead architect for YashNav IT Solutions. 
    You excel at coding, design, and SEO. Provide expert-level responses.`,
  });

  return result.toTextStreamResponse();
}