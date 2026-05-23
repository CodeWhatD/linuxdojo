import { CommandResult, VirtualFS } from '../types/index.js';
import { parseCommandInput } from './parser.js';
import { getCommand } from './commands/index.js';
import { writeFile } from './filesystem.js';

export function execute(fs: VirtualFS, input: string, stdin = ''): CommandResult {
  const chain = parseCommandInput(input);

  if (chain.commands.length === 0) {
    return { stdout: '', stderr: '', exitCode: 0, fs };
  }

  if (chain.commands.length === 1 && !chain.redirect) {
    const cmd = chain.commands[0];
    const handler = getCommand(cmd.command);
    if (!handler) {
      return { stdout: '', stderr: `${cmd.command}: command not found`, exitCode: 127, fs };
    }
    return handler(fs, cmd, stdin);
  }

  // Pipe chain
  let currentFs = fs;
  let pipeOutput = stdin;

  for (let i = 0; i < chain.commands.length; i++) {
    const cmd = chain.commands[i];
    const handler = getCommand(cmd.command);
    if (!handler) {
      return { stdout: '', stderr: `${cmd.command}: command not found`, exitCode: 127, fs: currentFs };
    }
    const result = handler(currentFs, cmd, pipeOutput);
    currentFs = result.fs;
    pipeOutput = result.stdout;

    if (result.exitCode !== 0 && i < chain.commands.length - 1) {
      return { stdout: '', stderr: result.stderr, exitCode: result.exitCode, fs: currentFs };
    }
  }

  // Handle redirect
  if (chain.redirect) {
    const writeResult = writeFile(currentFs, chain.redirect.target, pipeOutput, chain.redirect.operator === '>>');
    if (writeResult.exitCode !== 0) {
      return { stdout: '', stderr: writeResult.stderr, exitCode: 1, fs: currentFs };
    }
    return { stdout: '', stderr: '', exitCode: 0, fs: writeResult.fs };
  }

  return { stdout: pipeOutput, stderr: '', exitCode: 0, fs: currentFs };
}
