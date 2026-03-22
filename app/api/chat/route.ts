import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Read the manual for YashNav logic
  const docPath = path.join(process.cwd(), 'context', 'yashnav-docs.md');
  const masterManual = fs.existsSync(docPath) ? fs.readFileSync(docPath, 'utf8') : "Lead Architect for YashNav IT Solutions.";

  const result = await streamText({
    model: google('gemini-1.5-pro'),
    messages: messages, // Pass directly to avoid naming errors
    system: `
      YOU ARE NEXORA AI, THE ELITE EXECUTION ENGINE FOR YASHNAV IT SOLUTIONS.
      MASTER MANUAL DATA: ${masterManual}
      - Execute all coding, design, and SEO tasks based on YashNav standards.
      - Output professional Markdown and production-ready code.
    `,
  });

  return result.toDataStreamResponse();
}