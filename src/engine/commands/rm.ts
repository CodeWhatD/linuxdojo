import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { rm as fsRm } from '../filesystem.js';

export function rm(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const recursive = parsed.flags['r'] === true || parsed.flags['R'] === true || parsed.flags['recursive'] === true;
  const force = parsed.flags['f'] === true || parsed.flags['force'] === true;
  const path = parsed.args[0];

  if (!path) return { stdout: '', stderr: 'rm: missing operand', exitCode: 1, fs };

  const result = fsRm(fs, path, recursive, force);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
