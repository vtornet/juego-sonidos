<script lang="ts">
  import { game, getSoundEmojis, getCurrentLevel } from '../stores/game';
  import ProgressBar from './ProgressBar.svelte';

  const BASE_PATH = import.meta.env.BASE_URL || '/juego-sonidos/';
  const TOTAL_SOUNDS = 42;
  const TOTAL_ERRORS = 6;

  let soundUrls: string[] = [];
  let mortalSoundUrl = '';
  let isPlaying = false;

  function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  $: if ($game.state === 'playing' && $game.difficulty) {
    const level = getCurrentLevel($game.difficulty, $game.currentLevelIndex);
    loadSounds(level.totalButtons);
  }

  function loadSounds(count: number) {
    // El mortalIndex viene del store
    const mortalIndex = $game.mortalIndex;

    // Índices de sonidos normales (necesitamos count - 1 sonidos normales)
    const allIndices = Array.from({ length: TOTAL_SOUNDS }, (_, i) => i + 1);
    const selected = shuffleArray(allIndices).slice(0, count - 1);

    console.log('Sonidos normales seleccionados:', selected);

    // Crear array de URLs: el mortal no tendrá sonido normal
    soundUrls = [];
    let soundIdx = 0;

    for (let i = 0; i < count; i++) {
      if (i === mortalIndex) {
        // Posición mortal: sin sonido normal
        soundUrls.push('');
        console.log(`Botón ${i} es MORTAL (sin sonido normal)`);
      } else {
        // Posición normal: asignar sonido
        const url = `${BASE_PATH}sounds/${selected[soundIdx]}.mp3`;
        soundUrls.push(url);
        console.log(`Botón ${i}: ${url}`);
        soundIdx++;
      }
    }

    // Sonido mortal
    const errorIdx = Math.floor(Math.random() * TOTAL_ERRORS) + 1;
    mortalSoundUrl = `${BASE_PATH}sounds/Error${errorIdx}.mp3`;

    console.log('--- Carga completa. Mortal index:', mortalIndex, 'URL mortal:', mortalSoundUrl);
  }

  function handleButtonClick(index: number) {
    if ($game.pressedButtons.has(index) || isPlaying) return;

    if (index === $game.mortalIndex) {
      // Botón mortal: solo cambiar estado (GameOver reproduce el sonido)
      game.pressButton(index);
      return;
    }

    // Botón normal: reproducir sonido
    isPlaying = true;
    const audio = new Audio(soundUrls[index]);
    audio.volume = 0.6;
    audio.play();
    audio.onended = () => {
      isPlaying = false;
      game.pressButton(index);
    };
  }

  function getEmoji(index: number): string {
    return ['🔔', '🎺', '🥁', '🎸', '🎹', '🔊', '🎤', '🎷', '🪘', '🎻'][index % 10];
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
          {getEmoji(i)}
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
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 1rem;
    max-width: 400px;
    margin: 0 auto;
  }

  .sound-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
