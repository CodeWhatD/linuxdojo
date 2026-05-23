import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface SaveEntry {
  stars: number;
  attempts: number;
  hintsUsed: number;
}

export interface SaveData {
  completedChallenges: Record<string, SaveEntry>;
}

export const SAVE_FILE_NAME = '.learn-linux-save.json';

let saveFilePath: string;

export function getSaveFilePath(): string {
  if (!saveFilePath) {
    saveFilePath = join(process.cwd(), SAVE_FILE_NAME);
  }
  return saveFilePath;
}

export function loadProgress(): SaveData {
  try {
    const path = getSaveFilePath();
    if (!existsSync(path)) return { completedChallenges: {} };
    const raw = readFileSync(path, 'utf-8');
    return JSON.parse(raw) as SaveData;
  } catch {
    return { completedChallenges: {} };
  }
}

export function saveProgress(data: SaveData): void {
  try {
    const path = getSaveFilePath();
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // 静默失败，不影响游戏体验
  }
}
