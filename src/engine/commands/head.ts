import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { readFile } from '../filesystem.js';

export function head(fs: VirtualFS, parsed: ParsedCommand, stdin = ''): CommandResult {
  let numLines = 10;

  // Handle -n flag: could be -n 5 (flag=true, value in args) or as parsed value
  if (parsed.flags['n'] !== undefined) {
    numLines = typeof parsed.flags['n'] === 'string' ? parseInt(parsed.flags['n'], 10) : 10;
  }

  // Check for -<number> shorthand like -1
  for (const arg of parsed.args) {
    if (/^-\d+$/.test(arg)) {
      numLines = parseInt(arg.slice(1), 10);
    }
  }

  // If flags[n] is true (boolean), the number is the first arg
  if (parsed.flags['n'] === true && parsed.args.length > 0) {
    const first = parsed.args[0];
    if (/^\d+$/.test(first)) {
      numLines = parseInt(first, 10);
      parsed = { ...parsed, args: parsed.args.slice(1) };
    }
  }

  let inputText = stdin;

  if (parsed.args.length > 0) {
    const filePath = parsed.args.find(a => !/^\d+$/.test(a));
    if (filePath) {
      const result = readFile(fs, filePath);
      if (result.exitCode !== 0) return { stdout: '', stderr: result.stderr, exitCode: 1, fs };
      inputText = result.stdout;
    }
  } else if (!stdin) {
    return { stdout: '', stderr: '', exitCode: 0, fs };
  }

  const lines = inputText.split('\n').slice(0, numLines);
  return { stdout: lines.join('\n'), stderr: '', exitCode: 0, fs };
}
