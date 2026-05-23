import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { mkdir as fsMkdir } from '../filesystem.js';

export function mkdir(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const recursive = parsed.flags['p'] === true || parsed.flags['parents'] === true;
  const path = parsed.args[0];

  if (!path) {
    return { stdout: '', stderr: 'mkdir: missing operand', exitCode: 1, fs };
  }

  const result = fsMkdir(fs, path, recursive);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
