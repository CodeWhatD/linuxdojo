import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { listDir, resolvePath } from '../filesystem.js';

export function ls(fs: VirtualFS, parsed: ParsedCommand, _stdin?: string): CommandResult {
  const showAll = parsed.flags['a'] === true || parsed.flags['all'] === true;
  const longFormat = parsed.flags['l'] === true;
  const path = parsed.args[0] || null;

  const result = listDir(fs, path, showAll, longFormat);
  return { stdout: result.stdout, stderr: result.stderr, exitCode: result.exitCode, fs };
}
