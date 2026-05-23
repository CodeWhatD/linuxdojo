import { Challenge } from '../types/challenge.js';

export const permissionsChallenges: Challenge[] = [
  {
    id: 'perm-01',
    category: 'permissions',
    level: 1,
    title: '添加执行权限',
    description: '给 notes.txt 文件添加可执行权限。',
    hints: ['用 chmod 命令加 +x', '输入 chmod +x notes.txt'],
    validation: {
      acceptedCommands: ['chmod +x notes.txt'],
    },
  },
];
