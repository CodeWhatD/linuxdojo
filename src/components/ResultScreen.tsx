import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { getChallengesByCategory } from '../challenges/index.js';
import { GameActionType } from '../types/index.js';
import { useLocale } from '../i18n/LocaleContext.js';
import { getChallengeText } from '../i18n/index.js';

export function ResultScreen() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();
  const [selected, setSelected] = useState(0);

  if (!state.selectedCategory) return null;

  const challenges = getChallengesByCategory(state.selectedCategory);
  const challenge = challenges[state.currentChallengeIndex];
  if (!challenge) return null;

  const score = state.scores.get(challenge.id);
  const stars = score?.stars ?? 1;
  const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  const chTitle = getChallengeText(challenge.id, 'title', challenge.title);

  const options = [
    { key: 'next', label: t('result.nextChallenge') },
    { key: 'retry', label: t('result.retryChallenge') },
    { key: 'back', label: t('result.backToCategory') },
  ] as const;

  useInput((_, key) => {
    if (key.upArrow) {
      setSelected(prev => (prev > 0 ? prev - 1 : prev));
    } else if (key.downArrow) {
      setSelected(prev => (prev < options.length - 1 ? prev + 1 : prev));
    } else if (key.return) {
      const action = options[selected].key;
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
        <Text bold>{chTitle}</Text>
        <Text>{t('result.rating')}: <Text color="yellow">{starStr}</Text></Text>
        <Text dimColor>{t('result.attempts')}: {state.attempts} | {t('result.hints')}: {state.hintIndex}</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        {options.map((opt, i) => (
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
