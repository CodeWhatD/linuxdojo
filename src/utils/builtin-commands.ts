export interface BuiltinCommand {
  cmd: string;
  alias: string;
  desc: string;
}

export const CHALLENGE_COMMANDS: BuiltinCommand[] = [
  { cmd: ':hint', alias: ':h', desc: '查看提示' },
  { cmd: ':reset', alias: ':r', desc: '重置关卡' },
  { cmd: ':back', alias: ':b', desc: '返回' },
];

export const RESULT_COMMANDS: BuiltinCommand[] = [
  { cmd: ':retry', alias: ':r', desc: '重玩本关' },
  { cmd: ':back', alias: ':b', desc: '返回类别选择' },
];

export function filterCommands(commands: BuiltinCommand[], input: string): BuiltinCommand[] {
  if (!input.startsWith(':')) return [];
  const lower = input.toLowerCase();
  return commands.filter(c => c.cmd.startsWith(lower) || c.alias.startsWith(lower));
}

export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  const first = strings[0];
  let i = 0;
  while (i < first.length && strings.every(s => s[i] === first[i])) {
    i++;
  }
  return first.slice(0, i);
}
