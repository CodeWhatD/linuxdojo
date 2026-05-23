import React, { useState, useCallback } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useGame } from '../state/GameContext.js';
import { categories, getChallengesByCategory } from '../challenges/index.js';
import { CATEGORY_META } from '../types/challenge.js';
import { GameActionType } from '../types/index.js';

export function CategoryScreen() {
  const { state, dispatch } = useGame();
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    setInput('');

    const num = parseInt(trimmed, 10);
    if (num >= 1 && num <= categories.length) {
      dispatch({ type: GameActionType.SELECT_CATEGORY, category: categories[num - 1] });
    }
  }, [dispatch]);

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text color="cyan" bold>选择学习类别</Text>
      </Box>

      {categories.map((cat, i) => {
        const meta = CATEGORY_META[cat];
        const challenges = getChallengesByCategory(cat);
        const completed = challenges.filter(c => state.completedChallenges.has(c.id)).length;
        const total = challenges.length;

        return (
          <Box key={cat}>
            <Text>
              <Text color="yellow">[{i + 1}]</Text>{' '}
              <Text bold>{meta.label}</Text>
              <Text dimColor> ({completed}/{total} 完成)</Text>
            </Text>
          </Box>
        );
      })}

      <Box marginTop={1}>
        <Text color="green">{'>'} </Text>
        <TextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          placeholder="输入编号选择类别"
        />
      </Box>
    </Box>
  );
}
