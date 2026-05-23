import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { pwd as fsPwd } from '../filesystem.js';

export function pwd(fs: VirtualFS, _parsed: ParsedCommand): CommandResult {
  return { stdout: fsPwd(fs), stderr: '', exitCode: 0, fs };
}
