import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { find as fsFind, resolvePath } from '../filesystem.js';

export function find(fs: VirtualFS, parsed: ParsedCommand): CommandResult {
  const args = parsed.args;
  const flags = parsed.flags;

  let startPath = '.';
  let namePattern: string | undefined;
  let typeFilter: 'file' | 'directory' | undefined;

  // Parse args: find [path] [options]
  if (args.length > 0 && !args[0].startsWith('-')) {
    startPath = args[0];
  }

  // Look for -name and -type in args
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-name' && args[i + 1]) {
      namePattern = args[i + 1];
      i++;
    } else if (args[i] === '-type' && args[i + 1]) {
      if (args[i + 1] === 'f') typeFilter = 'file';
      else if (args[i + 1] === 'd') typeFilter = 'directory';
      i++;
    }
  }

  if (flags['name'] && typeof flags['name'] === 'string') namePattern = flags['name'];
  if (flags['type'] === 'f' || flags['type'] === 'file') typeFilter = 'file';
  if (flags['type'] === 'd' || flags['type'] === 'directory') typeFilter = 'directory';

  const results = fsFind(fs, startPath, namePattern, typeFilter);
  return { stdout: results.join('\n'), stderr: '', exitCode: 0, fs };
}
