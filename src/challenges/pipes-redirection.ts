import { Challenge } from '../types/challenge.js';

export const pipesRedirectionChallenges: Challenge[] = [
  {
    id: 'pipe-01',
    category: 'pipes-redirection',
    level: 1,
    title: '管道：统计文件数量',
    description: '使用管道统计当前目录下有多少个文件和目录。',
    hints: ['用 ls 列出文件，通过管道 | 传给 wc 统计行数', '输入 ls | wc -l'],
    validation: {
      acceptedCommands: ['ls | wc -l'],
    },
  },
  {
    id: 'pipe-02',
    category: 'pipes-redirection',
    level: 2,
    title: '管道：搜索并排序',
    description: '列出 notes.txt 中包含字母 "o" 的行，并按字母排序。',
    hints: ['用 grep 过滤后通过管道传给 sort', '输入 grep o notes.txt | sort'],
    validation: {
      acceptedCommands: ['grep o notes.txt | sort'],
    },
  },
  {
    id: 'pipe-03',
    category: 'pipes-redirection',
    level: 3,
    title: '输出重定向',
    description: '将 notes.txt 的内容复制到 backup.txt 中（使用重定向）。',
    hints: ['用 cat 读取文件，用 > 重定向到新文件', '输入 cat notes.txt > backup.txt'],
    validation: {
      acceptedCommands: ['cat notes.txt > backup.txt'],
    },
  },
];
