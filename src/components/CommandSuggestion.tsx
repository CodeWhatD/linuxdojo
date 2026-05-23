import React from 'react';
import { Box, Text } from 'ink';
import { BuiltinCommand } from '../utils/builtin-commands.js';
import { t } from '../i18n/index.js';

interface Props {
  commands: BuiltinCommand[];
  input: string;
}

export function CommandSuggestion({ commands, input }: Props) {
  if (!input.startsWith(':')) return null;

  const lower = input.toLowerCase();
  const matches = commands.filter(
    c => c.cmd.startsWith(lower) || c.alias.startsWith(lower),
  );

  if (matches.length === 0) return null;

  return (
    <Box flexDirection="column" paddingLeft={3}>
      {matches.map(c => (
        <Text key={c.cmd} dimColor>
          <Text color="cyan">{c.cmd}</Text>
          <Text dimColor> ({c.alias})</Text>
          <Text dimColor> — {t(c.descKey)}</Text>
        </Text>
      ))}
    </Box>
  );
}
