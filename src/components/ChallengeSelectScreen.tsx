import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { getChallengesByCategory } from '../challenges/index.js';
import { CATEGORY_META } from '../types/challenge.js';
import { GameActionType } from '../types/index.js';

export function ChallengeSelectScreen() {
  const { state, dispatch } = useGame();

  if (!state.selectedCategory) return null;

  const challenges = getChallengesByCategory(state.selectedCategory);
  const meta = CATEGORY_META[state.selectedCategory];
  const [selectedIndex, setSelectedIndex] = useState(
    Math.min(state.currentChallengeIndex, challenges.length - 1),
  );

  useInput((_, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (key.downArrow) {
      setSelectedIndex(prev => (prev < challenges.length - 1 ? prev + 1 : prev));
    } else if (key.return) {
      dispatch({ type: GameActionType.SELECT_CHALLENGE, index: selectedIndex });
    } else if (key.escape) {
      dispatch({ type: GameActionType.GO_CATEGORY });
    }
  });

  return (
    <Box flexDirection="column">
      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text>
          <Text color="cyan" bold>{meta.label}</Text>
          <Text dimColor> | </Text>
          <Text>选择关卡</Text>
        </Text>
      </Box>

      <Box flexDirection="column" marginTop={1} paddingX={1}>
        {challenges.map((ch, i) => {
          const score = state.scores.get(ch.id);
          const isCompleted = state.completedChallenges.has(ch.id);
          const isSelected = i === selectedIndex;

          const prefix = isSelected ? '>' : ' ';
          const stars = score ? '★'.repeat(score.stars) + '☆'.repeat(3 - score.stars) : '';
          const statusIcon = isCompleted ? <Text color="green">✓</Text> : <Text dimColor>○</Text>;

          return (
            <Text key={ch.id}>
              <Text color={isSelected ? 'cyan' : undefined}>{prefix} </Text>
              {statusIcon}{' '}
              <Text color={isSelected ? 'cyan' : undefined}>{i + 1}. {ch.title}</Text>
              {stars && <Text color="yellow"> {stars}</Text>}
            </Text>
          );
        })}
      </Box>

      <Box marginTop={1} paddingX={1}>
        <Text dimColor>↑↓ 选择 | Enter 开始 | Esc 返回</Text>
      </Box>
    </Box>
  );
}
