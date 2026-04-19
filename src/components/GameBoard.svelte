<script lang="ts">
  import { onMount } from 'svelte';
  import { game, getSoundEmojis, getCurrentLevel } from '../stores/game';
  import { audioManager } from '../stores/audioManager';
  import ProgressBar from './ProgressBar.svelte';

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
    const mortalIndex = $game.mortalIndex;

    // Obtener sonidos normales del AudioManager (sin repetir)
    const normalSounds = audioManager.getNormalSounds(count - 1);

    console.log('📊 Stats:', audioManager.getStats());
    console.log('🔊 Sonidos normales cargados:', normalSounds.length);

    // Crear array de URLs: el mortal no tendrá sonido normal
    soundUrls = [];
    let soundIdx = 0;

    for (let i = 0; i < count; i++) {
      if (i === mortalIndex) {
        soundUrls.push('');
        console.log(`Botón ${i} es MORTAL`);
      } else {
        soundUrls.push(normalSounds[soundIdx]);
        soundIdx++;
      }
    }

    // Sonido mortal del AudioManager
    mortalSoundUrl = audioManager.getErrorSound();
    console.log('Mortal URL:', mortalSoundUrl);
  }

  function handleButtonClick(index: number) {
    if ($game.pressedButtons.has(index) || isPlaying) return;

    if (index === $game.mortalIndex) {
      // Botón mortal: solo cambiar estado
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
    audio.onerror = () => {
      console.error('Error cargando audio:', soundUrls[index]);
      isPlaying = false;
      game.pressButton(index);
    };
  }

  function getEmoji(index: number): string {
    return ['🔔', '🎺', '🥁', '🎸', '🎹', '🔊', '🎤', '🎷', '🪘', '🎻'][index % 10];
  }

  // Reiniciar AudioManager solo cuando es un nuevo juego
  $: if ($game.isNewGame) {
    audioManager.reset();
    console.log('🎮 Nuevo juego - AudioManager reiniciado');
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
