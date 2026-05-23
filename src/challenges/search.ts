import { Challenge } from '../types/challenge.js';

export const searchChallenges: Challenge[] = [
  {
    id: 'search-01',
    category: 'search',
    level: 1,
    title: '按名称查找文件',
    description: '在当前目录及其子目录中查找名为 report.txt 的文件。',
    hints: ['用 find 命令配合 -name 参数', '输入 find . -name report.txt'],
    validation: {
      acceptedCommands: ['find . -name report.txt'],
    },
  },
];
