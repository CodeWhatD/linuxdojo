import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { cd as fsCd } from '../filesystem.js';

export function cd(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const path = parsed.args[0] || '~';
  const result = fsCd(fs, path);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
