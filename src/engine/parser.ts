import { parse as shellParse } from 'shell-quote';
import { ParsedCommand, PipeChain } from '../types/index.js';

export function parseCommandInput(input: string): PipeChain {
  const trimmed = input.trim();
  if (!trimmed) return { commands: [] };

  // Split by pipe, respecting quotes
  const segments = splitByPipe(trimmed);

  const commands: ParsedCommand[] = [];
  let redirect: PipeChain['redirect'];

  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i].trim();

    // Last segment: check for redirect
    if (i === segments.length - 1) {
      const redirectMatch = segment.match(/^(.*?)>>(.+)$|^(.*?)>(.+)$/);
      if (redirectMatch) {
        if (redirectMatch[1] !== undefined) {
          segment = redirectMatch[1].trim();
          redirect = { operator: '>>', target: redirectMatch[2].trim() };
        } else {
          segment = redirectMatch[3].trim();
          redirect = { operator: '>', target: redirectMatch[4].trim() };
        }
      }
    }

    if (!segment) continue;
    commands.push(parseSingleCommand(segment));
  }

  return { commands, redirect };
}

function splitByPipe(input: string): string[] {
  const result: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch === "'" && !inDouble) { inSingle = !inSingle; current += ch; continue; }
    if (ch === '"' && !inSingle) { inDouble = !inDouble; current += ch; continue; }
    if (ch === '|' && !inSingle && !inDouble) {
      result.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current) result.push(current);
  return result;
}

function parseSingleCommand(segment: string): ParsedCommand {
  const tokens = shellParse(segment) as string[];
  if (tokens.length === 0) return { command: '', args: [], flags: {} };

  const command = String(tokens[0]);
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < tokens.length; i++) {
    const token = String(tokens[i]);
    if (token.startsWith('--')) {
      const flagBody = token.slice(2);
      if (flagBody.includes('=')) {
        const [key, val] = flagBody.split('=', 2);
        flags[key] = val;
      } else {
        flags[flagBody] = true;
      }
    } else if (token.startsWith('-') && token.length > 1 && !/^-\d+$/.test(token)) {
      const flagChars = token.slice(1);
      for (const ch of flagChars) {
        flags[ch] = true;
      }
    } else {
      args.push(token);
    }
  }

  return { command, args, flags };
}
