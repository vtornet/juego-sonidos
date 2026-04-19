import { writable } from 'svelte/store';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  level: number;
  totalButtons: number;
  goal: number;
}

export const LEVELS: Record<Difficulty, Level[]> = {
  easy: [
    { level: 1, totalButtons: 15, goal: 3 },
    { level: 2, totalButtons: 13, goal: 4 },
    { level: 3, totalButtons: 12, goal: 5 },
    { level: 4, totalButtons: 11, goal: 6 },
    { level: 5, totalButtons: 10, goal: 7 },
    { level: 6, totalButtons: 9,  goal: 7 },
  ],
  medium: [
    { level: 1, totalButtons: 12, goal: 4 },
    { level: 2, totalButtons: 11, goal: 5 },
    { level: 3, totalButtons: 10, goal: 6 },
    { level: 4, totalButtons: 9,  goal: 7 },
    { level: 5, totalButtons: 8,  goal: 7 },
  ],
  hard: [
    { level: 1, totalButtons: 10, goal: 5 },
    { level: 2, totalButtons: 9,  goal: 6 },
    { level: 3, totalButtons: 8,  goal: 7 },
    { level: 4, totalButtons: 8,  goal: 7 },
  ],
};

export type GameState = 'menu' | 'playing' | 'levelComplete' | 'gameover' | 'victory';

interface GameData {
  state: GameState;
  difficulty: Difficulty | null;
  currentLevelIndex: number;
  correctPressed: number;
  mortalIndex: number;
  pressedButtons: Set<number>;
  startTime: number;
}

function createGameStore() {
  const { subscribe, set, update } = writable<GameData>({
    state: 'menu',
    difficulty: null,
    currentLevelIndex: 0,
    correctPressed: 0,
    mortalIndex: -1,
    pressedButtons: new Set(),
    startTime: 0,
  });

  return {
    subscribe,
    startGame: (difficulty: Difficulty) => {
      update((data) => ({
        ...data,
        state: 'playing',
        difficulty,
        currentLevelIndex: 0,
        correctPressed: 0,
        mortalIndex: Math.floor(Math.random() * LEVELS[difficulty][0].totalButtons),
        pressedButtons: new Set(),
        startTime: Date.now(),
      }));
    },
    pressButton: (buttonIndex: number) => {
      update((data) => {
        if (data.state !== 'playing') return data;
        if (data.pressedButtons.has(buttonIndex)) return data;

        const currentLevel = LEVELS[data.difficulty!][data.currentLevelIndex];

        if (buttonIndex === data.mortalIndex) {
          return { ...data, state: 'gameover' };
        }

        const newPressed = new Set(data.pressedButtons);
        newPressed.add(buttonIndex);
        const newCorrect = data.correctPressed + 1;

        if (newCorrect >= currentLevel.goal) {
          if (data.currentLevelIndex >= LEVELS[data.difficulty!].length - 1) {
            return { ...data, state: 'victory', correctPressed: newCorrect, pressedButtons: newPressed };
          }
          return { ...data, state: 'levelComplete', correctPressed: newCorrect, pressedButtons: newPressed };
        }

        return { ...data, correctPressed: newCorrect, pressedButtons: newPressed };
      });
    },
    goToMenu: () => {
      set({
        state: 'menu',
        difficulty: null,
        currentLevelIndex: 0,
        correctPressed: 0,
        mortalIndex: -1,
        pressedButtons: new Set(),
        startTime: 0,
      });
    },
    retry: () => {
      update((data) => {
        if (!data.difficulty) return data;
        const currentLevel = LEVELS[data.difficulty][0];
        return {
          ...data,
          state: 'playing',
          currentLevelIndex: 0,
          correctPressed: 0,
          mortalIndex: Math.floor(Math.random() * currentLevel.totalButtons),
          pressedButtons: new Set(),
          startTime: Date.now(),
        };
      });
    },
    nextLevel: () => {
      update((data) => {
        if (!data.difficulty || data.state !== 'levelComplete') return data;
        const nextLevelIndex = data.currentLevelIndex + 1;
        return {
          ...data,
          state: 'playing',
          currentLevelIndex: nextLevelIndex,
          correctPressed: 0,
          mortalIndex: Math.floor(Math.random() * LEVELS[data.difficulty][nextLevelIndex].totalButtons),
          pressedButtons: new Set(),
        };
      });
    },
  };
}

export const game = createGameStore();

export const getCurrentLevel = (difficulty: Difficulty, levelIndex: number): Level => {
  return LEVELS[difficulty][levelIndex];
};

export const getSoundEmojis = (): string[] => {
  return ['🔔', '🎺', '🥁', '🎸', '🎹', '🔊', '🎤', '🎷', '🪘', '🎻', '🪕', '🎼', '🎵', '🎶', '🔔'];
};
