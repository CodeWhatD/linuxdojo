import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { chmod as fsChmod } from '../filesystem.js';

export function chmod(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const mode = parsed.args[0];
  const path = parsed.args[1];

  if (!mode || !path) {
    return { stdout: '', stderr: 'chmod: missing operand', exitCode: 1, fs };
  }

  const result = fsChmod(fs, path, mode);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
