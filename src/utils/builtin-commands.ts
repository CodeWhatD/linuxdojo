export interface BuiltinCommand {
  cmd: string;
  alias: string;
  descKey: string;
}

export const CHALLENGE_COMMANDS: BuiltinCommand[] = [
  { cmd: ':hint', alias: ':h', descKey: 'commands.hint' },
  { cmd: ':reset', alias: ':r', descKey: 'commands.reset' },
  { cmd: ':back', alias: ':b', descKey: 'commands.back' },
];

export const RESULT_COMMANDS: BuiltinCommand[] = [
  { cmd: ':retry', alias: ':r', descKey: 'commands.retry' },
  { cmd: ':back', alias: ':b', descKey: 'commands.backToCategory' },
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
