import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { readFile } from '../filesystem.js';

export function uniq(fs: VirtualFS, parsed: ParsedCommand, stdin = ''): CommandResult {
  let inputText = stdin;

  if (parsed.args.length > 0) {
    const result = readFile(fs, parsed.args[0]);
    if (result.exitCode !== 0) return { stdout: '', stderr: result.stderr, exitCode: 1, fs };
    inputText = result.stdout;
  } else if (!stdin) {
    return { stdout: '', stderr: 'uniq: missing file argument', exitCode: 1, fs };
  }

  const lines = inputText.split('\n');
  const result: string[] = [];
  let prev = '';

  for (const line of lines) {
    if (line !== prev) {
      result.push(line);
      prev = line;
    }
  }

  return { stdout: result.join('\n'), stderr: '', exitCode: 0, fs };
}
