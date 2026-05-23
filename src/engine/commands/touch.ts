import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { touch as fsTouch } from '../filesystem.js';

export function touch(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const path = parsed.args[0];
  if (!path) return { stdout: '', stderr: 'touch: missing file operand', exitCode: 1, fs };

  const result = fsTouch(fs, path);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
