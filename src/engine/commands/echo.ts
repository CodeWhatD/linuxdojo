import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';

export function echo(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const hasN = parsed.flags['n'] === true;
  const text = parsed.args.join(' ');
  const output = hasN ? text : text + '\n';
  return { stdout: output, stderr: '', exitCode: 0, fs };
}
