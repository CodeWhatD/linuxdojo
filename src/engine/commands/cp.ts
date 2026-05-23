import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { cp as fsCp } from '../filesystem.js';

export function cp(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const recursive = parsed.flags['r'] === true || parsed.flags['R'] === true || parsed.flags['recursive'] === true;
  const args = parsed.args;

  if (args.length < 2) return { stdout: '', stderr: 'cp: missing file operand', exitCode: 1, fs };

  const src = args[0];
  const dest = args[args.length - 1];

  if (args.length > 2) {
    // Multiple sources -> dest must be directory
    for (let i = 0; i < args.length - 1; i++) {
      const result = fsCp(fs, args[i], dest, recursive);
      if (result.exitCode !== 0) return { stdout: '', stderr: result.stderr, exitCode: 1, fs: result.fs };
      fs = result.fs;
    }
    return { stdout: '', stderr: '', exitCode: 0, fs };
  }

  const result = fsCp(fs, src, dest, recursive);
  return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: result.fs };
}
