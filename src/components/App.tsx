import React from 'react';
import { Box, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { Screen, GameActionType } from '../types/index.js';
import { WelcomeScreen } from './WelcomeScreen.js';
import { CategoryScreen } from './CategoryScreen.js';
import { ChallengeSelectScreen } from './ChallengeSelectScreen.js';
import { ChallengeScreen } from './ChallengeScreen.js';
import { ResultScreen } from './ResultScreen.js';
import { LanguageSelectScreen } from './LanguageSelectScreen.js';

export function App() {
  const { state, dispatch } = useGame();

  // 全局 Ctrl+Shift+L 打开语言选择
  useInput((input, key) => {
    if (key.ctrl && key.shift && (input === 'L' || input === 'l')) {
      if (state.screen !== Screen.LANGUAGE_SELECT) {
        dispatch({ type: GameActionType.OPEN_LANG_SELECT });
      }
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      {state.screen === Screen.WELCOME && <WelcomeScreen />}
      {state.screen === Screen.CATEGORY && <CategoryScreen />}
      {state.screen === Screen.CHALLENGE_SELECT && <ChallengeSelectScreen />}
      {state.screen === Screen.CHALLENGE && <ChallengeScreen />}
      {state.screen === Screen.RESULT && <ResultScreen />}
      {state.screen === Screen.LANGUAGE_SELECT && <LanguageSelectScreen />}
    </Box>
  );
}
