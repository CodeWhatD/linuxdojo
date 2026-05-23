export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  const first = strings[0];
  let i = 0;
  while (i < first.length && strings.every(s => s[i] === first[i])) {
    i++;
  }
  return first.slice(0, i);
}

/**
 * 根据当前输入和候选列表，返回 Tab 补全结果（完整字符串），或 null 表示无补全。
 * 仅补全第一个词（命令名）。
 */
export function findCompletion(input: string, candidates: string[]): string | null {
  if (input.includes(' ') || !input) return null;

  const matches = candidates.filter(c => c.startsWith(input) && c !== input);

  if (matches.length === 0) {
    if (candidates.includes(input)) return input + ' ';
    return null;
  }

  if (matches.length === 1) {
    return matches[0] + ' ';
  }

  const common = longestCommonPrefix(matches);
  if (common.length > input.length) return common;

  return null;
}
