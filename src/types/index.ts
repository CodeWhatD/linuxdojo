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

export enum GameActionType {
  GO_HOME = 'GO_HOME',
  GO_CATEGORY = 'GO_CATEGORY',
  SELECT_CATEGORY = 'SELECT_CATEGORY',
  SELECT_CHALLENGE = 'SELECT_CHALLENGE',
  SUBMIT_RESULT = 'SUBMIT_RESULT',
  SHOW_HINT = 'SHOW_HINT',
  NEXT_CHALLENGE = 'NEXT_CHALLENGE',
  RESET_CHALLENGE = 'RESET_CHALLENGE',
  RETRY_CHALLENGE = 'RETRY_CHALLENGE',
  GO_CHALLENGE_LIST = 'GO_CHALLENGE_LIST',
}

export enum Screen {
  WELCOME = 'welcome',
  CATEGORY = 'category',
  CHALLENGE_SELECT = 'challenge-select',
  CHALLENGE = 'challenge',
  RESULT = 'result',
}

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
  | { type: GameActionType.GO_HOME }
  | { type: GameActionType.GO_CATEGORY }
  | { type: GameActionType.SELECT_CATEGORY; category: import('./challenge').ChallengeCategory }
  | { type: GameActionType.SELECT_CHALLENGE; index: number }
  | { type: GameActionType.SUBMIT_RESULT; correct: boolean; message: string; stdout: string; stderr: string }
  | { type: GameActionType.SHOW_HINT }
  | { type: GameActionType.NEXT_CHALLENGE }
  | { type: GameActionType.RESET_CHALLENGE }
  | { type: GameActionType.RETRY_CHALLENGE }
  | { type: GameActionType.GO_CHALLENGE_LIST };
