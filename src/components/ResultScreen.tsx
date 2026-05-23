import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { getChallengesByCategory } from '../challenges/index.js';
import { GameActionType } from '../types/index.js';

const OPTIONS = [
  { key: 'next', label: '选择下一关' },
  { key: 'retry', label: '重玩本关' },
  { key: 'back', label: '返回类别选择' },
] as const;

export function ResultScreen() {
  const { state, dispatch } = useGame();
  const [selected, setSelected] = useState(0);

  if (!state.selectedCategory) return null;

  const challenges = getChallengesByCategory(state.selectedCategory);
  const challenge = challenges[state.currentChallengeIndex];
  if (!challenge) return null;

  const score = state.scores.get(challenge.id);
  const stars = score?.stars ?? 1;
  const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);

  useInput((_, key) => {
    if (key.upArrow) {
      setSelected(prev => (prev > 0 ? prev - 1 : prev));
    } else if (key.downArrow) {
      setSelected(prev => (prev < OPTIONS.length - 1 ? prev + 1 : prev));
    } else if (key.return) {
      const action = OPTIONS[selected].key;
      if (action === 'next') {
        dispatch({ type: GameActionType.NEXT_CHALLENGE });
      } else if (action === 'retry') {
        dispatch({ type: GameActionType.RETRY_CHALLENGE });
      } else if (action === 'back') {
        dispatch({ type: GameActionType.GO_CATEGORY });
      }
    }
  });

  return (
    <Box flexDirection="column" alignItems="center">
      <Box flexDirection="column" borderStyle="round" borderColor="green" paddingX={2}>
        <Text bold>{challenge.title}</Text>
        <Text>评价: <Text color="yellow">{starStr}</Text></Text>
        <Text dimColor>尝试: {state.attempts} 次 | 提示: {state.hintIndex} 次</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        {OPTIONS.map((opt, i) => (
          <Text key={opt.key}>
            <Text color={i === selected ? 'cyan' : undefined}>
              {i === selected ? '> ' : '  '}{opt.label}
            </Text>
          </Text>
        ))}
      </Box>
    </Box>
  );
}
