import { CommandResult, ParsedCommand, VirtualFS } from '../../types/index.js';
import { ls } from './ls.js';
import { cd } from './cd.js';
import { pwd } from './pwd.js';
import { mkdir } from './mkdir.js';
import { rmdir } from './rmdir.js';
import { rm } from './rm.js';
import { touch } from './touch.js';
import { cat } from './cat.js';
import { echo } from './echo.js';
import { cp } from './cp.js';
import { mv } from './mv.js';
import { chmod } from './chmod.js';
import { grep } from './grep.js';
import { find } from './find.js';
import { head } from './head.js';
import { tail } from './tail.js';
import { wc } from './wc.js';
import { sort } from './sort.js';
import { uniq } from './uniq.js';

export type CommandHandler = (fs: VirtualFS, parsed: ParsedCommand, stdin?: string) => CommandResult;

const registry = new Map<string, CommandHandler>();

function register(name: string, handler: CommandHandler) {
  registry.set(name, handler);
}

register('ls', ls);
register('cd', cd);
register('pwd', pwd);
register('mkdir', mkdir);
register('rmdir', rmdir);
register('rm', rm);
register('touch', touch);
register('cat', cat);
register('echo', echo);
register('cp', cp);
register('mv', mv);
register('chmod', chmod);
register('grep', grep);
register('find', find);
register('head', head);
register('tail', tail);
register('wc', wc);
register('sort', sort);
register('uniq', uniq);

export function getCommand(name: string): CommandHandler | undefined {
  return registry.get(name);
}

export function getAllCommands(): string[] {
  return Array.from(registry.keys());
}
