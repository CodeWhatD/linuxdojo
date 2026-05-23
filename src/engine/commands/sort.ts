import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { readFile } from '../filesystem.js';

export function sort(fs: VirtualFS, parsed: ParsedCommand, stdin = ''): CommandResult {
  const reverse = parsed.flags['r'] === true;

  let inputText = stdin;

  if (parsed.args.length > 0) {
    const result = readFile(fs, parsed.args[0]);
    if (result.exitCode !== 0) return { stdout: '', stderr: result.stderr, exitCode: 1, fs };
    inputText = result.stdout;
  } else if (!stdin) {
    return { stdout: '', stderr: 'sort: missing file argument', exitCode: 1, fs };
  }

  const lines = inputText.split('\n').filter(Boolean);
  lines.sort();
  if (reverse) lines.reverse();

  return { stdout: lines.join('\n'), stderr: '', exitCode: 0, fs };
}
