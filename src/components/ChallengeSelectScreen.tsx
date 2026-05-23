import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { getChallengesByCategory } from '../challenges/index.js';
import { GameActionType } from '../types/index.js';
import { useLocale } from '../i18n/LocaleContext.js';
import { getChallengeText } from '../i18n/index.js';

export function ChallengeSelectScreen() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();

  if (!state.selectedCategory) return null;

  const challenges = getChallengesByCategory(state.selectedCategory);
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
          <Text color="cyan" bold>{t('categories.' + state.selectedCategory)}</Text>
          <Text dimColor> | </Text>
          <Text>{t('challengeSelect.title')}</Text>
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
          const title = getChallengeText(ch.id, 'title', ch.title);

          return (
            <Text key={ch.id}>
              <Text color={isSelected ? 'cyan' : undefined}>{prefix} </Text>
              {statusIcon}{' '}
              <Text color={isSelected ? 'cyan' : undefined}>{i + 1}. {title}</Text>
              {stars && <Text color="yellow"> {stars}</Text>}
            </Text>
          );
        })}
      </Box>

      <Box marginTop={1} paddingX={1}>
        <Text dimColor>{t('challengeSelect.navHint')}</Text>
      </Box>
    </Box>
  );
}
