import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await generateText({
    model: google('gemini-1.5-pro'),
    messages,
    system: `You are NEXORA AI, the lead architect for YashNav IT Solutions. 
    You excel at coding, design, and SEO. Provide expert-level responses.`,
  });

  return Response.json({ content: result.text });
}