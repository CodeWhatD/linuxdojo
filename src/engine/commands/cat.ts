import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { readFile } from '../filesystem.js';

export function cat(fs: VirtualFS, parsed: ParsedCommand, stdin = ''): CommandResult {
  if (parsed.args.length === 0 && stdin) {
    return { stdout: stdin, stderr: '', exitCode: 0, fs };
  }

  const outputs: string[] = [];
  const stderrs: string[] = [];
  let exitCode = 0;

  for (const arg of parsed.args) {
    const result = readFile(fs, arg);
    if (result.exitCode !== 0) {
      stderrs.push(result.stderr);
      exitCode = 1;
    } else {
      outputs.push(result.stdout);
    }
  }

  return { stdout: outputs.join('\n'), stderr: stderrs.join('\n'), exitCode, fs };
}
