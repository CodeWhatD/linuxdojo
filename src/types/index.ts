export type FsNodeType = 'file' | 'directory';

export interface FsNode {
  name: string;
  type: FsNodeType;
  permissions: string;
  content: string;
  children: Map<string, FsNode>;
  parent: FsNode | null;
  modifiedAt: Date;
  createdAt: Date;
}

export interface VirtualFS {
  root: FsNode;
  cwd: FsNode;
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  fs: VirtualFS;
}

export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export interface PipeChain {
  commands: ParsedCommand[];
  redirect?: { operator: '>' | '>>'; target: string };
}

export type FsSnapshotEntry = string | FsSnapshot;
export interface FsSnapshot {
  [key: string]: FsSnapshotEntry;
}

// 游戏状态相关类型

export type Screen = 'welcome' | 'category' | 'challenge-select' | 'challenge' | 'result';

export interface ChallengeScore {
  challengeId: string;
  attempts: number;
  hintsUsed: number;
  stars: number;
}

export interface GameState {
  screen: Screen;
  selectedCategory: import('./challenge').ChallengeCategory | null;
  currentChallengeIndex: number;
  completedChallenges: Set<string>;
  scores: Map<string, ChallengeScore>;
  hintIndex: number;
  attempts: number;
  currentFs: VirtualFS;
  lastOutput: string;
  lastError: string;
  lastCorrect: boolean | null;
  lastMessage: string;
}

export type GameAction =
  | { type: 'GO_HOME' }
  | { type: 'GO_CATEGORY' }
  | { type: 'SELECT_CATEGORY'; category: import('./challenge').ChallengeCategory }
  | { type: 'SELECT_CHALLENGE'; index: number }
  | { type: 'SUBMIT_RESULT'; correct: boolean; message: string; stdout: string; stderr: string }
  | { type: 'SHOW_HINT' }
  | { type: 'NEXT_CHALLENGE' }
  | { type: 'RESET_CHALLENGE' }
  | { type: 'RETRY_CHALLENGE' }
  | { type: 'GO_CHALLENGE_LIST' };
