import React, { useState, useCallback } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useGame } from '../state/GameContext.js';
import { GameActionType } from '../types/index.js';
import { getSaveFilePath } from '../utils/storage.js';
import { useLocale } from '../i18n/LocaleContext.js';

export function WelcomeScreen() {
  const { dispatch } = useGame();
  const { t, locale, toggleLocale } = useLocale();
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim().toLowerCase();
    setInput('');
    if (trimmed === ':lang' || trimmed === ':l') {
      toggleLocale();
      return;
    }
    if (trimmed === '' || trimmed === 'start' || trimmed === 's') {
      dispatch({ type: GameActionType.GO_CATEGORY });
    }
  }, [dispatch, toggleLocale]);

  const langLabel = locale === 'zh' ? '中文' : 'English';

  return (
    <Box flexDirection="column" alignItems="center">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ╔══════════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text color="cyan" bold>║</Text>
        <Text color="green" bold>  {t('welcome.title').padEnd(40)}  </Text>
        <Text color="cyan" bold>║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ╚══════════════════════════════════════════╝
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>{t('welcome.subtitle')}</Text>
      </Box>

      <Box flexDirection="column">
        <Text>{t('welcome.startPrompt', { key: 'Enter' })}</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>{t('welcome.saveFile', { path: getSaveFilePath() })}</Text>
      </Box>
      <Box>
        <Text dimColor>{t('welcome.dontModify')}</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="green">{'>'} </Text>
        <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} placeholder={t('welcome.placeholder')} />
      </Box>

      <Box marginTop={1}>
        <Text dimColor>:lang ({langLabel})</Text>
      </Box>
    </Box>
  );
}
