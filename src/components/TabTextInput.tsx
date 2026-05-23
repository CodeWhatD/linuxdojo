import { useState, useEffect, useRef } from 'react';
import { Text, useInput } from 'ink';
import { findCompletion } from '../utils/tab-completion.js';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  focus?: boolean;
  completionCandidates?: string[];
}

export function TabTextInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  focus = true,
  completionCandidates = [],
}: Props) {
  const [cursorIndex, setCursorIndex] = useState(value.length);
  const internalChange = useRef(false);

  // 外部修改 value 时（如 submit 后清空），同步光标到末尾
  useEffect(() => {
    if (!internalChange.current) {
      setCursorIndex(value.length);
    }
    internalChange.current = false;
  }, [value]);

  useInput((ch, key) => {
    if (!focus) return;

    if (key.return) {
      onSubmit(value);
      return;
    }

    if (key.backspace) {
      if (cursorIndex > 0) {
        internalChange.current = true;
        onChange(value.slice(0, cursorIndex - 1) + value.slice(cursorIndex));
        setCursorIndex(prev => prev - 1);
      }
      return;
    }

    if (key.delete) {
      if (cursorIndex < value.length) {
        internalChange.current = true;
        onChange(value.slice(0, cursorIndex) + value.slice(cursorIndex + 1));
      }
      return;
    }

    if (key.left) {
      if (cursorIndex > 0) setCursorIndex(prev => prev - 1);
      return;
    }

    if (key.right) {
      if (cursorIndex < value.length) setCursorIndex(prev => prev + 1);
      return;
    }

    if (key.home) {
      setCursorIndex(0);
      return;
    }

    if (key.end) {
      setCursorIndex(value.length);
      return;
    }

    if (key.tab && completionCandidates.length > 0) {
      const completed = findCompletion(value, completionCandidates);
      if (completed) {
        internalChange.current = true;
        onChange(completed);
        setCursorIndex(completed.length);
      }
      return;
    }

    if (ch && !key.ctrl && !key.meta) {
      internalChange.current = true;
      onChange(value.slice(0, cursorIndex) + ch + value.slice(cursorIndex));
      setCursorIndex(prev => prev + ch.length);
    }
  }, { isActive: focus });

  const ci = Math.min(cursorIndex, value.length);
  const before = value.slice(0, ci);
  const cursorChar = value.slice(ci, ci + 1) || ' ';
  const after = value.slice(ci + 1);

  if (!value && placeholder) {
    return (
      <Text>
        <Text inverse color="gray">{placeholder[0]}</Text>
        <Text color="gray">{placeholder.slice(1)}</Text>
      </Text>
    );
  }

  return (
    <Text>
      {before}
      <Text inverse>{cursorChar}</Text>
      {after}
    </Text>
  );
}
