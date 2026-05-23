import React, { useState, useEffect } from 'react';
import { Text, useInput } from 'ink';
import { longestCommonPrefix } from '../utils/builtin-commands.js';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  focus?: boolean;
  showCursor?: boolean;
  completionCandidates?: string[];
}

export function CustomTextInput({
  value,
  onChange,
  onSubmit,
  focus = true,
  showCursor = true,
  completionCandidates = [],
}: Props) {
  const [cursorOffset, setCursorOffset] = useState(value.length);

  // 外部重置 value 时（如 submit 后清空），光标同步到合法位置
  useEffect(() => {
    setCursorOffset(prev => {
      if (prev > value.length) return value.length;
      if (prev < 0) return 0;
      return prev;
    });
  }, [value.length]);

  useInput(
    (input, key) => {
      if (key.return) {
        onSubmit(value);
        return;
      }

      let nextOffset = cursorOffset;
      let nextValue = value;

      if (key.tab && completionCandidates.length > 0 && value) {
        // 补全第一个词（命令名），保留后面的参数不变
        const firstSpaceIdx = value.indexOf(' ');
        const currentWord = firstSpaceIdx === -1 ? value : value.slice(0, firstSpaceIdx);
        const rest = firstSpaceIdx === -1 ? '' : value.slice(firstSpaceIdx);
        const matches = completionCandidates.filter(
          c => c.startsWith(currentWord) && c !== currentWord,
        );

        if (matches.length === 1) {
          // 唯一匹配：完整补全，无后续参数时加空格
          nextValue = matches[0] + (rest || ' ');
          nextOffset = matches[0].length + (rest ? 0 : 1);
        } else if (matches.length > 1) {
          // 多匹配：补全到公共前缀
          const common = longestCommonPrefix(matches);
          if (common.length > currentWord.length) {
            nextValue = common + rest;
            nextOffset = common.length;
          }
        } else if (completionCandidates.includes(currentWord) && !rest) {
          // 已是完整命令且无参数，加空格
          nextValue = currentWord + ' ';
          nextOffset = currentWord.length + 1;
        }
      } else if (key.backspace || key.delete) {
        if (cursorOffset > 0) {
          nextValue = value.slice(0, cursorOffset - 1) + value.slice(cursorOffset);
          nextOffset = cursorOffset - 1;
        }
      } else if (key.leftArrow) {
        nextOffset = cursorOffset - 1;
      } else if (key.rightArrow) {
        nextOffset = cursorOffset + 1;
      } else if (!key.ctrl && !key.meta && input.length > 0 && !key.tab) {
        nextValue = value.slice(0, cursorOffset) + input + value.slice(cursorOffset);
        nextOffset = cursorOffset + input.length;
      }

      if (nextOffset < 0) nextOffset = 0;
      if (nextOffset > nextValue.length) nextOffset = nextValue.length;

      setCursorOffset(nextOffset);
      if (nextValue !== value) {
        onChange(nextValue);
      }
    },
    { isActive: focus },
  );

  const clampedOffset = Math.min(Math.max(cursorOffset, 0), value.length);

  if (!showCursor || !focus) {
    return <Text>{value}</Text>;
  }

  let rendered = '';
  for (let i = 0; i < value.length; i++) {
    rendered += i === clampedOffset ? `\x1B[7m${value[i]}\x1B[27m` : value[i];
  }
  if (clampedOffset === value.length) {
    rendered += '\x1B[7m \x1B[27m';
  }

  return <Text>{rendered}</Text>;
}
