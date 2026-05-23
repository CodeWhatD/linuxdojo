import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { mv as fsMv } from '../filesystem.js';

export function mv(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const args = parsed.args;
  if (args.length < 2) return { stdout: '', stderr: 'mv: missing file operand', exitCode: 1, fs };

  const result = fsMv(fs, args[0], args[1]);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
