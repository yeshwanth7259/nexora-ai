import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages } from 'ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 📂 READ THE MASTER MANUAL
  const docPath = path.join(process.cwd(), 'context', 'yashnav-docs.md');
  const masterManual = fs.readFileSync(docPath, 'utf8');

  const result = await streamText({
    model: google('gemini-1.5-pro'),
    messages: convertToCoreMessages(messages),
    system: `
      YOU ARE NEXORA AI. 
      YOU HAVE ACCESS TO THE YASHNAV MASTER MANUAL:
      ---
      ${masterManual}
      ---
      INSTRUCTIONS:
      - Use the technical stack and brand colors defined above for ALL code and design.
      - If the user asks to "Build Load Maker," reference the logic in the manual.
      - Execute Coding, Design, SEO, and Deployment strategies as the Lead Architect of YashNav.
    `,
  });

  return result.toDataStreamResponse();
}