import React, { useState, useCallback, useMemo } from 'react';
import { Box, Text, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { getChallengesByCategory } from '../challenges/index.js';

export function ResultScreen() {
  const { state, dispatch } = useGame();

  if (!state.selectedCategory) return null;

  const challenges = getChallengesByCategory(state.selectedCategory);
  const challenge = challenges[state.currentChallengeIndex];
  if (!challenge) return null;

  const score = state.scores.get(challenge.id);
  const stars = score?.stars ?? 1;
  const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  const hasMore = state.currentChallengeIndex < challenges.length - 1;

  useInput((_, key) => {
    if (key.return) {
      dispatch({ type: 'NEXT_CHALLENGE' });
    } else if (key.escape) {
      dispatch({ type: 'GO_CATEGORY' });
    }
  });

  return (
    <Box flexDirection="column" alignItems="center">
      <Text>
        <Text color="green" bold>{challenge.title}</Text>
        <Text> — </Text>
        <Text color="yellow">{starStr}</Text>
      </Text>

      {state.lastMessage && (
        <Text dimColor>{state.lastMessage}</Text>
      )}

      <Box marginTop={1}>
        <Text dimColor>按 <Text color="yellow">Enter</Text> {hasMore ? '选择下一关' : '返回列表'} | <Text color="yellow">Esc</Text> 返回类别</Text>
      </Box>
    </Box>
  );
}
