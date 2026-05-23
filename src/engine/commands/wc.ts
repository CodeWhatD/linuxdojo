import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { readFile } from '../filesystem.js';

export function wc(fs: VirtualFS, parsed: ParsedCommand, stdin = ''): CommandResult {
  let inputText = stdin;
  let fileName = '';

  if (parsed.args.length > 0) {
    const result = readFile(fs, parsed.args[0]);
    if (result.exitCode !== 0) return { stdout: '', stderr: result.stderr, exitCode: 1, fs };
    inputText = result.stdout;
    fileName = parsed.args[0];
  } else if (!stdin) {
    return { stdout: '', stderr: 'wc: missing file argument', exitCode: 1, fs };
  }

  const lines = inputText.split('\n').length;
  const words = inputText.split(/\s+/).filter(Boolean).length;
  const chars = inputText.length;

  const output = `${String(lines).padStart(7)} ${String(words).padStart(7)} ${String(chars).padStart(7)}${fileName ? ' ' + fileName : ''}`;
  return { stdout: output, stderr: '', exitCode: 0, fs };
}
