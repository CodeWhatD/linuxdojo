import { Challenge } from '../types/challenge.js';

export const textProcessingChallenges: Challenge[] = [
  {
    id: 'text-01',
    category: 'text-processing',
    level: 1,
    title: '搜索文本',
    description: '在 notes.txt 中查找包含 "milk" 的行。',
    hints: ['用 grep 命令', '输入 grep milk notes.txt'],
    validation: {
      acceptedCommands: ['grep milk notes.txt'],
    },
  },
  {
    id: 'text-02',
    category: 'text-processing',
    level: 2,
    title: '统计文件信息',
    description: '统计 notes.txt 的行数、单词数和字节数。',
    hints: ['用 wc 命令', '输入 wc notes.txt'],
    validation: {
      acceptedCommands: ['wc notes.txt'],
    },
  },
  {
    id: 'text-03',
    category: 'text-processing',
    level: 3,
    title: '排序',
    description: '将 notes.txt 的内容按字母顺序排序输出。',
    hints: ['用 sort 命令', '输入 sort notes.txt'],
    validation: {
      acceptedCommands: ['sort notes.txt'],
    },
  },
];
