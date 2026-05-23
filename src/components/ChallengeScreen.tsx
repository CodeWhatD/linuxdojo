import React, { useState, useCallback, useMemo } from 'react';
import { Box, Text } from 'ink';
import { useGame } from '../state/GameContext.js';
import { getChallengesByCategory } from '../challenges/index.js';
import { GameActionType } from '../types/index.js';
import { execute } from '../engine/executor.js';
import { validateChallenge } from '../engine/validator.js';
import { createRoot } from '../engine/filesystem.js';
import { CommandSuggestion } from './CommandSuggestion.js';
import { CHALLENGE_COMMANDS } from '../utils/builtin-commands.js';
import { getAllCommands } from '../engine/commands/index.js';
import { CustomTextInput } from './CustomTextInput.js';
import { useLocale } from '../i18n/LocaleContext.js';
import { getChallengeText, getChallengeHints } from '../i18n/index.js';

export function ChallengeScreen() {
  const { state, dispatch } = useGame();
  const { t } = useLocale();
  const [input, setInput] = useState('');
  const [outputLines, setOutputLines] = useState<string[]>([]);

  const challenges = state.selectedCategory != null
    ? getChallengesByCategory(state.selectedCategory)
    : [];
  const challenge = challenges[state.currentChallengeIndex];

  const completionCandidates = useMemo(() => {
    const metaCmds = CHALLENGE_COMMANDS.flatMap(c => [c.cmd, c.alias]);
    return [...metaCmds, ...getAllCommands()];
  }, []);

  if (!state.selectedCategory || !challenge) return null;

  const progress = `${state.currentChallengeIndex + 1}/${challenges.length}`;
  const chTitle = getChallengeText(challenge.id, 'title', challenge.title);
  const chDesc = getChallengeText(challenge.id, 'description', challenge.description);
  const chHints = getChallengeHints(challenge.id, challenge.hints);

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setInput('');

    if (trimmed === ':hint' || trimmed === ':h') {
      if (state.hintIndex < chHints.length) {
        dispatch({ type: GameActionType.SHOW_HINT });
      }
      return;
    }
    if (trimmed === ':reset' || trimmed === ':r') {
      dispatch({ type: GameActionType.RESET_CHALLENGE });
      setOutputLines([]);
      return;
    }
    if (trimmed === ':back' || trimmed === ':b') {
      dispatch({ type: GameActionType.GO_CHALLENGE_LIST });
      return;
    }

    const fs = createRoot();
    const result = execute(fs, trimmed);
    const validation = validateChallenge(challenge, result, trimmed);

    const newLines: string[] = [`$ ${trimmed}`];
    if (result.stdout) newLines.push(result.stdout);
    if (result.stderr) newLines.push(result.stderr);
    newLines.push('');

    setOutputLines(prev => [...prev, ...newLines]);

    dispatch({
      type: GameActionType.SUBMIT_RESULT,
      correct: validation.correct,
      message: validation.message,
      stdout: result.stdout,
      stderr: result.stderr,
    });
  }, [challenge, dispatch, state.hintIndex, chHints.length]);

  const visibleHints = chHints.slice(0, state.hintIndex);

  return (
    <Box flexDirection="column">
      {/* Header */}
      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text>
          <Text color="cyan" bold>{t('categories.' + state.selectedCategory)}</Text>
          <Text dimColor> | </Text>
          <Text>{t('challenge.headerProgress', { progress })}</Text>
          <Text dimColor> | </Text>
          <Text bold>{chTitle}</Text>
        </Text>
      </Box>

      {/* Description */}
      <Box marginTop={1} paddingX={1}>
        <Text>{chDesc}</Text>
      </Box>

      {/* Hints */}
      {visibleHints.length > 0 && (
        <Box flexDirection="column" paddingX={1}>
          {visibleHints.map((hint, i) => (
            <Text key={i} color="yellow">{t('challenge.hintLabel')}: {hint}</Text>
          ))}
        </Box>
      )}

      {state.hintIndex < chHints.length && (
        <Box paddingX={1}>
          <Text dimColor>{t('challenge.hintsAvailable', { count: chHints.length - state.hintIndex })}</Text>
        </Box>
      )}

      {/* Previous output */}
      {outputLines.length > 0 && (
        <Box flexDirection="column" paddingX={1}>
          {outputLines.map((line, i) => (
            <Text key={i}>{line}</Text>
          ))}
        </Box>
      )}

      {/* Feedback */}
      {state.lastCorrect === false && state.lastMessage && (
        <Box paddingX={1}>
          <Text color="red">{state.lastMessage}</Text>
        </Box>
      )}

      {/* Input */}
      <Box paddingX={1}>
        <Text color="green">$ </Text>
        <CustomTextInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          completionCandidates={completionCandidates}
        />
      </Box>

      <CommandSuggestion commands={CHALLENGE_COMMANDS} input={input} />

      {/* Footer */}
      <Box marginTop={1} paddingX={1}>
        <Text dimColor>{t('challenge.footer')}</Text>
      </Box>
    </Box>
  );
}
