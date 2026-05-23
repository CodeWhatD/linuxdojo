import React from 'react';
import { Box } from 'ink';
import { useGame } from '../state/GameContext.js';
import { Screen } from '../types/index.js';
import { WelcomeScreen } from './WelcomeScreen.js';
import { CategoryScreen } from './CategoryScreen.js';
import { ChallengeSelectScreen } from './ChallengeSelectScreen.js';
import { ChallengeScreen } from './ChallengeScreen.js';
import { ResultScreen } from './ResultScreen.js';

export function App() {
  const { state } = useGame();

  return (
    <Box flexDirection="column" padding={1}>
      {state.screen === Screen.WELCOME && <WelcomeScreen />}
      {state.screen === Screen.CATEGORY && <CategoryScreen />}
      {state.screen === Screen.CHALLENGE_SELECT && <ChallengeSelectScreen />}
      {state.screen === Screen.CHALLENGE && <ChallengeScreen />}
      {state.screen === Screen.RESULT && <ResultScreen />}
    </Box>
  );
}
