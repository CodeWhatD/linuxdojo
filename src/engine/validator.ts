import { Challenge } from '../types/challenge.js';
import { CommandResult } from '../types/index.js';
import { t } from '../i18n/index.js';

export interface ValidationResult {
  correct: boolean;
  message: string;
}

function normalizeCommand(input: string): string {
  let s = input.trim();
  // Expand combined short flags: -la -> -l -a
  s = s.replace(/ -([a-zA-Z]{2,})/g, (_, flags) =>
    flags.split('').map((f: string) => ` -${f}`).join(''),
  );
  // Collapse whitespace
  s = s.replace(/\s+/g, ' ');
  // Sort flags for comparison
  const parts = s.split(' ');
  const flagParts: string[] = [];
  const otherParts: string[] = [];
  let inFlags = true;
  for (const part of parts) {
    if (inFlags && part.startsWith('-')) {
      flagParts.push(part);
    } else {
      inFlags = false;
      otherParts.push(part);
    }
  }
  flagParts.sort();
  return [...flagParts, ...otherParts].join(' ');
}

export function validateChallenge(
  challenge: Challenge,
  commandResult: CommandResult,
  rawInput: string,
): ValidationResult {
  const v = challenge.validation;

  // Method 1: Check accepted commands
  if (v.acceptedCommands && v.acceptedCommands.length > 0) {
    const normalized = normalizeCommand(rawInput);
    const match = v.acceptedCommands.some(
      cmd => normalizeCommand(cmd) === normalized,
    );
    if (match) {
      return { correct: true, message: t('validation.correct') };
    }
  }

  // Method 2: Check output pattern
  if (v.expectedOutputPattern) {
    const regex = new RegExp(v.expectedOutputPattern);
    if (regex.test(commandResult.stdout)) {
      return { correct: true, message: t('validation.correct') };
    }
  }

  // If command had an error, show it
  if (commandResult.stderr) {
    return { correct: false, message: commandResult.stderr };
  }

  return { correct: false, message: t('validation.tryAgain') };
}
