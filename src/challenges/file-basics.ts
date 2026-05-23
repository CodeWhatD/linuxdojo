import { Challenge } from '../types/challenge.js';
import { FsSnapshot } from '../types/index.js';

const defaultSnapshot: FsSnapshot = {
  home: {
    user: {
      Documents: {
        'report.txt': 'Annual Report 2024\nQuarterly summary here.',
      },
      Downloads: {},
      'notes.txt': 'Remember to buy milk\nCall mom\nFinish project',
      '.bashrc': 'export PATH=$PATH:/usr/local/bin',
      '.hidden': 'secret data',
    },
  },
  tmp: {},
  etc: {
    'config.json': '{"name":"learn-linux","version":"1.0"}',
  },
};

export const fileBasicsChallenges: Challenge[] = [
  {
    id: 'file-basics-01',
    category: 'file-basics',
    level: 1,
    title: '列出文件',
    description: '列出当前目录下的所有文件和目录。',
    hints: ['试试 ls 命令', '直接输入 ls 即可'],
    validation: {
      acceptedCommands: ['ls'],
    },
  },
  {
    id: 'file-basics-02',
    category: 'file-basics',
    level: 2,
    title: '显示隐藏文件',
    description: '列出当前目录下所有文件，包括隐藏文件（以 . 开头的文件）。',
    hints: ['需要加一个参数来显示隐藏文件', '试试 ls -a 或 ls --all'],
    validation: {
      acceptedCommands: ['ls -a', 'ls -la', 'ls -al', 'ls --all', 'ls -a -l', 'ls -l -a'],
    },
  },
  {
    id: 'file-basics-03',
    category: 'file-basics',
    level: 3,
    title: '查看当前路径',
    description: '显示你当前所在的目录完整路径。',
    hints: ['用 pwd 命令', 'pwd = print working directory'],
    validation: {
      acceptedCommands: ['pwd'],
    },
  },
  {
    id: 'file-basics-04',
    category: 'file-basics',
    level: 4,
    title: '切换目录',
    description: '进入 Documents 目录。',
    hints: ['用 cd 命令', '输入 cd Documents'],
    validation: {
      acceptedCommands: ['cd Documents', 'cd Documents/'],
    },
  },
  {
    id: 'file-basics-05',
    category: 'file-basics',
    level: 5,
    title: '创建目录',
    description: '创建一个名为 projects 的新目录。',
    hints: ['用 mkdir 命令', '输入 mkdir projects'],
    validation: {
      acceptedCommands: ['mkdir projects'],
    },
  },
  {
    id: 'file-basics-06',
    category: 'file-basics',
    level: 6,
    title: '创建文件',
    description: '创建一个名为 todo.txt 的空文件。',
    hints: ['用 touch 命令', '输入 touch todo.txt'],
    validation: {
      acceptedCommands: ['touch todo.txt'],
    },
  },
  {
    id: 'file-basics-07',
    category: 'file-basics',
    level: 7,
    title: '删除文件',
    description: '删除 notes.txt 文件。',
    hints: ['用 rm 命令', '输入 rm notes.txt'],
    validation: {
      acceptedCommands: ['rm notes.txt'],
    },
  },
  {
    id: 'file-basics-08',
    category: 'file-basics',
    level: 8,
    title: '复制文件',
    description: '将 notes.txt 复制一份，命名为 notes_backup.txt。',
    hints: ['用 cp 命令', '输入 cp notes.txt notes_backup.txt'],
    validation: {
      acceptedCommands: ['cp notes.txt notes_backup.txt'],
    },
  },
  {
    id: 'file-basics-09',
    category: 'file-basics',
    level: 9,
    title: '移动/重命名文件',
    description: '将 notes.txt 重命名为 old_notes.txt。',
    hints: ['用 mv 命令来移动或重命名', '输入 mv notes.txt old_notes.txt'],
    validation: {
      acceptedCommands: ['mv notes.txt old_notes.txt'],
    },
  },
  {
    id: 'file-basics-10',
    category: 'file-basics',
    level: 10,
    title: '删除目录',
    description: '删除空的 Downloads 目录。',
    hints: ['用 rmdir 可以删除空目录', '输入 rmdir Downloads'],
    validation: {
      acceptedCommands: ['rmdir Downloads'],
    },
  },
];
