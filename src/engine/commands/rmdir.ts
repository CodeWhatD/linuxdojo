import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { rmdir as fsRmdir } from '../filesystem.js';

export function rmdir(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const path = parsed.args[0];
  if (!path) return { stdout: '', stderr: 'rmdir: missing operand', exitCode: 1, fs };

  const result = fsRmdir(fs, path);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
