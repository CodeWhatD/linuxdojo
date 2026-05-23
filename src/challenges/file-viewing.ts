import { Challenge } from '../types/challenge.js';

export const fileViewingChallenges: Challenge[] = [
  {
    id: 'file-viewing-01',
    category: 'file-viewing',
    level: 1,
    title: '查看文件内容',
    description: '显示 notes.txt 文件的全部内容。',
    hints: ['用 cat 命令', '输入 cat notes.txt'],
    validation: {
      acceptedCommands: ['cat notes.txt'],
    },
  },
  {
    id: 'file-viewing-02',
    category: 'file-viewing',
    level: 2,
    title: '查看文件头部',
    description: '显示 Documents/report.txt 的前 1 行。',
    hints: ['用 head 命令配合 -n 参数', '输入 head -n 1 Documents/report.txt'],
    validation: {
      acceptedCommands: ['head -n 1 Documents/report.txt', 'head -1 Documents/report.txt'],
    },
  },
  {
    id: 'file-viewing-03',
    category: 'file-viewing',
    level: 3,
    title: '查看文件尾部',
    description: '显示 Documents/report.txt 的最后 1 行。',
    hints: ['用 tail 命令配合 -n 参数', '输入 tail -n 1 Documents/report.txt'],
    validation: {
      acceptedCommands: ['tail -n 1 Documents/report.txt', 'tail -1 Documents/report.txt'],
    },
  },
];
