import React from 'react';
import { Box } from 'ink';
import { useGame } from '../state/GameContext.js';
import { WelcomeScreen } from './WelcomeScreen.js';
import { CategoryScreen } from './CategoryScreen.js';
import { ChallengeSelectScreen } from './ChallengeSelectScreen.js';
import { ChallengeScreen } from './ChallengeScreen.js';
import { ResultScreen } from './ResultScreen.js';

export function App() {
  const { state } = useGame();

  return (
    <Box flexDirection="column" padding={1}>
      {state.screen === 'welcome' && <WelcomeScreen />}
      {state.screen === 'category' && <CategoryScreen />}
      {state.screen === 'challenge-select' && <ChallengeSelectScreen />}
      {state.screen === 'challenge' && <ChallengeScreen />}
      {state.screen === 'result' && <ResultScreen />}
    </Box>
  );
}
