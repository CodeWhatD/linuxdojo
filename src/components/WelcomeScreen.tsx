import React, { useState, useCallback } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { useGame } from '../state/GameContext.js';
import { GameActionType } from '../types/index.js';
import { getSaveFilePath } from '../utils/storage.js';

export function WelcomeScreen() {
  const { dispatch } = useGame();
  const [input, setInput] = useState('');

  const handleSubmit = useCallback((value: string) => {
    const trimmed = value.trim().toLowerCase();
    setInput('');
    if (trimmed === '' || trimmed === 'start' || trimmed === 's') {
      dispatch({ type: GameActionType.GO_CATEGORY });
    }
  }, [dispatch]);

  return (
    <Box flexDirection="column" alignItems="center">
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ╔══════════════════════════════════════╗
        </Text>
      </Box>
      <Box>
        <Text color="cyan" bold>║</Text>
        <Text color="green" bold>     Learn Linux - 命令学习工具      </Text>
        <Text color="cyan" bold>║</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color="cyan" bold>
          ╚══════════════════════════════════════╝
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text dimColor>通过闯关模式，掌握 Linux 常用命令</Text>
      </Box>

      <Box flexDirection="column">
        <Text>按 <Text color="yellow">Enter</Text> 开始学习</Text>
      </Box>

      <Box marginTop={1}>
        <Text dimColor>存档文件: {getSaveFilePath()}</Text>
      </Box>
      <Box>
        <Text dimColor>(请勿手动修改存档文件)</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="green">{'>'} </Text>
        <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} placeholder="按 Enter 开始" />
      </Box>
    </Box>
  );
}
