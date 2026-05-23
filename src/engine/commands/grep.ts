import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { readFile, resolvePath } from '../filesystem.js';

export function grep(fs: VirtualFS, parsed: ParsedCommand, stdin = ''): CommandResult {
  const pattern = parsed.args[0];
  if (!pattern) return { stdout: '', stderr: 'grep: missing pattern', exitCode: 1, fs };

  const ignoreCase = parsed.flags['i'] === true;
  const lineNum = parsed.flags['n'] === true;
  const invert = parsed.flags['v'] === true;
  const regex = new RegExp(pattern, ignoreCase ? 'i' : '');

  let inputText = stdin;

  if (parsed.args.length > 1) {
    const filePath = parsed.args[1];
    const result = readFile(fs, filePath);
    if (result.exitCode !== 0) return { stdout: '', stderr: result.stderr, exitCode: 1, fs };
    inputText = result.stdout;
  } else if (!stdin) {
    return { stdout: '', stderr: 'grep: missing file argument', exitCode: 1, fs };
  }

  const lines = inputText.split('\n');
  const matched = lines.filter(line => {
    const match = regex.test(line);
    return invert ? !match : match;
  }).map((line, i) => {
    // Reset regex lastIndex for safety
    const originalLine = lines[lines.indexOf(line, i > 0 ? lines.indexOf(matched[i - 1]) + 1 : 0)];
    if (lineNum) {
      const lineIndex = lines.indexOf(line) + 1;
      return `${lineIndex}:${line}`;
    }
    return line;
  });

  return { stdout: matched.join('\n'), stderr: '', exitCode: matched.length > 0 ? 0 : 1, fs };
}
