import React, { createContext, useContext, useReducer } from 'react';
import { createRoot } from '../engine/filesystem.js';
import { getChallengesByCategory } from '../challenges/index.js';
import { loadProgress, saveProgress, SaveData } from '../utils/storage.js';
import { GameState, GameAction, ChallengeScore } from '../types/index.js';

/** 启动时从存档文件恢复已完成关卡和评分 */
function loadInitialState(): GameState {
  const saved = loadProgress();
  const completedChallenges = new Set(Object.keys(saved.completedChallenges));
  const scores = new Map<string, ChallengeScore>();
  for (const [id, entry] of Object.entries(saved.completedChallenges)) {
    scores.set(id, { challengeId: id, ...entry });
  }
  return {
    screen: 'welcome',
    selectedCategory: null,
    currentChallengeIndex: 0,
    completedChallenges,
    scores,
    hintIndex: 0,
    attempts: 0,
    currentFs: createRoot(),
    lastOutput: '',
    lastError: '',
    lastCorrect: null,
    lastMessage: '',
  };
}

const initialState = loadInitialState();

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_HOME':
      return { ...state, screen: 'welcome', selectedCategory: null, lastCorrect: null, lastMessage: '' };

    case 'GO_CATEGORY':
      return { ...state, screen: 'category' };

    case 'GO_CHALLENGE_LIST':
      return {
        ...state,
        screen: 'challenge-select',
        hintIndex: 0,
        attempts: 0,
        lastCorrect: null,
        lastMessage: '',
      };

    case 'SELECT_CATEGORY':
      return {
        ...state,
        screen: 'challenge-select',
        selectedCategory: action.category,
        currentChallengeIndex: 0,
        hintIndex: 0,
        attempts: 0,
        currentFs: createRoot(),
        lastOutput: '',
        lastError: '',
        lastCorrect: null,
        lastMessage: '',
      };

    case 'SELECT_CHALLENGE':
      return {
        ...state,
        screen: 'challenge',
        currentChallengeIndex: action.index,
        hintIndex: 0,
        attempts: 0,
        currentFs: createRoot(),
        lastOutput: '',
        lastError: '',
        lastCorrect: null,
        lastMessage: '',
      };

    case 'SUBMIT_RESULT': {
      const newAttempts = state.attempts + 1;
      if (action.correct) {
        const challengeId = getCurrentChallengeId(state);
        const stars = state.hintIndex === 0 && newAttempts === 1 ? 3
          : state.hintIndex <= 1 ? 2 : 1;
        const newCompleted = new Set(state.completedChallenges);
        newCompleted.add(challengeId);
        const newScores = new Map(state.scores);
        newScores.set(challengeId, { challengeId, attempts: newAttempts, hintsUsed: state.hintIndex, stars });

        // 答对时持久化存档
        const saveData: SaveData = { completedChallenges: {} };
        for (const [id, score] of newScores) {
          saveData.completedChallenges[id] = { stars: score.stars, attempts: score.attempts, hintsUsed: score.hintsUsed };
        }
        saveProgress(saveData);

        return {
          ...state,
          screen: 'result',
          attempts: newAttempts,
          lastOutput: action.stdout,
          lastError: action.stderr,
          lastCorrect: true,
          lastMessage: action.message,
          completedChallenges: newCompleted,
          scores: newScores,
        };
      }
      return {
        ...state,
        attempts: newAttempts,
        lastOutput: action.stdout,
        lastError: action.stderr,
        lastCorrect: false,
        lastMessage: action.message,
      };
    }

    case 'SHOW_HINT':
      return { ...state, hintIndex: state.hintIndex + 1 };

    case 'NEXT_CHALLENGE':
      return {
        ...state,
        screen: 'challenge-select',
        currentChallengeIndex: state.currentChallengeIndex + 1,
        hintIndex: 0,
        attempts: 0,
        currentFs: createRoot(),
        lastOutput: '',
        lastError: '',
        lastCorrect: null,
        lastMessage: '',
      };

    case 'RESET_CHALLENGE':
      return {
        ...state,
        hintIndex: 0,
        attempts: 0,
        currentFs: createRoot(),
        lastOutput: '',
        lastError: '',
        lastCorrect: null,
        lastMessage: '',
      };

    case 'RETRY_CHALLENGE':
      // 重玩当前关卡（不推进 index）
      return {
        ...state,
        screen: 'challenge',
        hintIndex: 0,
        attempts: 0,
        currentFs: createRoot(),
        lastOutput: '',
        lastError: '',
        lastCorrect: null,
        lastMessage: '',
      };

    default:
      return state;
  }
}

function getCurrentChallengeId(state: GameState): string {
  if (!state.selectedCategory) return '';
  const challenges = getChallengesByCategory(state.selectedCategory);
  const challenge = challenges[state.currentChallengeIndex];
  return challenge?.id ?? '';
}

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue>({
  state: initialState,
  dispatch: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
