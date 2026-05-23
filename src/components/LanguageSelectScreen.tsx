import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useGame } from '../state/GameContext.js';
import { GameActionType } from '../types/index.js';
import { useLocale } from '../i18n/LocaleContext.js';
import { Locale } from '../i18n/index.js';

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'English' },
];

export function LanguageSelectScreen() {
  const { dispatch } = useGame();
  const { locale, setLocaleNext } = useLocale();
  const [selected, setSelected] = useState(
    LANGUAGES.findIndex(l => l.code === locale) ?? 0,
  );

  useInput((_, key) => {
    if (key.upArrow) {
      setSelected(prev => (prev > 0 ? prev - 1 : prev));
    } else if (key.downArrow) {
      setSelected(prev => (prev < LANGUAGES.length - 1 ? prev + 1 : prev));
    } else if (key.return) {
      setLocaleNext(LANGUAGES[selected].code);
      dispatch({ type: GameActionType.CLOSE_LANG_SELECT });
    } else if (key.escape) {
      dispatch({ type: GameActionType.CLOSE_LANG_SELECT });
    }
  });

  return (
    <Box flexDirection="column" alignItems="center">
      <Box borderStyle="round" borderColor="cyan" paddingX={2}>
        <Text bold>Language / 语言</Text>
      </Box>

      <Box marginTop={1} flexDirection="column">
        {LANGUAGES.map((lang, i) => (
          <Text key={lang.code}>
            <Text color={i === selected ? 'cyan' : undefined}>
              {i === selected ? '> ' : '  '}{lang.label}
            </Text>
          </Text>
        ))}
      </Box>

      <Box marginTop={1}>
        <Text dimColor>↑↓ Select | Enter Confirm | Esc Cancel</Text>
      </Box>
    </Box>
  );
}
