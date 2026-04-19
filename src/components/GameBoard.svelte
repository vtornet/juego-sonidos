<script lang="ts">
  import { game, getCurrentLevel } from '../stores/game';
  import { audioManager } from '../stores/audioManager';
  import ProgressBar from './ProgressBar.svelte';

  const BASE_PATH = import.meta.env.BASE_URL || '/juego-sonidos/';
  let soundUrls: string[] = [];
  let mortalSoundUrl = '';
  let isPlaying = false;
  let lastDifficulty: string | null = null;
  let lastLevelIndex = -1;
  let memeIndices: number[] = [];  // Índices de memes para cada botón

  // Cargar sonidos solo cuando realmente cambia el nivel
  $: if ($game.state === 'playing' && $game.difficulty) {
    const diffKey = $game.difficulty;
    const levelIdx = $game.currentLevelIndex;

    // Solo recargar si cambió dificultad o nivel
    if (lastDifficulty !== diffKey || lastLevelIndex !== levelIdx) {
      lastDifficulty = diffKey;
      lastLevelIndex = levelIdx;

      const level = getCurrentLevel($game.difficulty, $game.currentLevelIndex);
      loadSounds(level.totalButtons);
    }
  }

  // Reiniciar AudioManager cuando es nuevo juego
  $: if ($game.isNewGame) {
    audioManager.reset();
    console.log('🎮 Nuevo juego - AudioManager reiniciado. Pool:', audioManager.getStats());
  }

  function loadSounds(count: number) {
    const mortalIndex = $game.mortalIndex;

    // Obtener sonidos normales SIN repetir
    const normalSounds = audioManager.getNormalSounds(count - 1);

    // Crear array de memes aleatorios (1-42)
    const allMemeIndices = Array.from({ length: 42 }, (_, i) => i + 1);
    const shuffledMemes = shuffleArray(allMemeIndices);
    memeIndices = shuffledMemes.slice(0, count);

    console.log(`🔊 Cargando ${count} botones. Mortal en índice ${mortalIndex}`);
    console.log('📊 Stats tras cargar:', audioManager.getStats());

    // Crear array de URLs de sonidos
    soundUrls = [];
    let soundIdx = 0;

    for (let i = 0; i < count; i++) {
      if (i === mortalIndex) {
        soundUrls.push('');
      } else {
        soundUrls.push(normalSounds[soundIdx]);
        soundIdx++;
      }
    }

    mortalSoundUrl = audioManager.getErrorSound();
  }

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function handleButtonClick(index: number) {
    if ($game.pressedButtons.has(index) || isPlaying) return;

    if (index === $game.mortalIndex) {
      game.pressButton(index);
      return;
    }

    isPlaying = true;
    const audio = new Audio(soundUrls[index]);
    audio.volume = 0.6;
    audio.play().catch(e => console.error('Error reproduciendo:', e));
    audio.onended = () => {
      isPlaying = false;
      game.pressButton(index);
    };
  }

  function getMemeUrl(index: number): string {
    return `${BASE_PATH}memes/${memeIndices[index]}.jpg`;
  }
</script>

<div class="card">
  {#if $game.difficulty && $game.state === 'playing'}
    {@const level = getCurrentLevel($game.difficulty, $game.currentLevelIndex)}
    <ProgressBar current={$game.correctPressed} total={level.goal} level={level.level} />

    <p class="subtitle" style="margin-top: 1rem;">¡Evita el SONIDO MORTAL!</p>

    <div class="game-grid">
      {#each Array(level.totalButtons) as _, i}
        <button
          class="sound-btn"
          class:correct={$game.pressedButtons.has(i)}
          disabled={$game.pressedButtons.has(i) || isPlaying}
          on:click={() => handleButtonClick(i)}
        >
          <img src={getMemeUrl(i)} alt="Meme" class="meme-img" loading="lazy" />
        </button>
      {/each}
    </div>

    {#if isPlaying}
      <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
        🔊 Reproduciendo sonido...
      </p>
    {/if}
  {/if}
</div>

<style>
  .game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
    gap: 0.75rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .sound-btn {
    width: 90px;
    height: 90px;
    padding: 0;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s ease;
    background: var(--bg-tertiary);
    overflow: hidden;
  }

  .sound-btn:hover:not(:disabled) {
    transform: scale(1.08);
  }

  .sound-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .sound-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: scale(0.9);
  }

  .meme-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
