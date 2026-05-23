export type ChallengeCategory =
  | 'file-basics'
  | 'file-viewing'
  | 'text-processing'
  | 'permissions'
  | 'search'
  | 'pipes-redirection';

export interface ChallengeValidation {
  acceptedCommands?: string[];
  expectedOutputPattern?: string;
  expectedFsChange?: (fsBefore: unknown, fsAfter: unknown) => boolean;
}

export interface Challenge {
  id: string;
  category: ChallengeCategory;
  level: number;
  title: string;
  description: string;
  hints: string[];
  validation: ChallengeValidation;
}

export const CATEGORY_META: Record<ChallengeCategory, { label: string; icon: string }> = {
  'file-basics': { label: '文件基础操作', icon: '1' },
  'file-viewing': { label: '文件查看', icon: '2' },
  'text-processing': { label: '文本处理', icon: '3' },
  'permissions': { label: '权限管理', icon: '4' },
  'search': { label: '搜索查找', icon: '5' },
  'pipes-redirection': { label: '管道与重定向', icon: '6' },
};
