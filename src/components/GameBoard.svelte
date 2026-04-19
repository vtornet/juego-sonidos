<script lang="ts">
  import { game, getSoundEmojis, getCurrentLevel } from '../stores/game';
  import { audioManager } from '../stores/audioManager';
  import ProgressBar from './ProgressBar.svelte';

  let soundUrls: string[] = [];
  let mortalSoundUrl = '';
  let isPlaying = false;
  let lastDifficulty: string | null = null;
  let lastLevelIndex = -1;

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

    console.log(`🔊 Cargando ${count} botones. Mortal en índice ${mortalIndex}`);
    console.log('📊 Stats tras cargar:', audioManager.getStats());
    console.log('Sonidos normales:', normalSounds.map(s => s.split('/').pop()));

    // Crear array de URLs
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
