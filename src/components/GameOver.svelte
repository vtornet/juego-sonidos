<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '../stores/game';
  import { audioManager } from '../stores/audioManager';
  import { shareResult, canUseNativeShare } from '../stores/share';

  let canRetry = false;
  let shareSuccess = false;
  let shareText = '📤 COMPARTIR';

  onMount(() => {
    const errorSound = audioManager.getErrorSound();
    const audio = new Audio(errorSound);
    audio.volume = 0.8;
    audio.play();

    audio.onended = () => {
      canRetry = true;
    };
  });

  async function handleShare() {
    const success = await shareResult({
      difficulty: $game.difficulty || 'easy',
      level: $game.currentLevelIndex + 1,
      time: 0,
      result: 'gameover'
    });

    if (success) {
      if (canUseNativeShare()) {
        shareText = '✓ Compartido';
        shareSuccess = true;
      } else {
        shareText = '✓ Copiado al portapapeles';
        shareSuccess = true;
      }
      setTimeout(() => {
        shareText = '📤 COMPARTIR';
        shareSuccess = false;
      }, 2000);
    }
  }

  function retry() {
    if (!canRetry) return;
    game.retry();
  }

  function goToMenu() {
    game.goToMenu();
  }
</script>

<div class="card" style="text-align: center;">
  <h1 class="title" style="color: var(--accent-danger);">💀 GAME OVER 💀</h1>

  <p class="subtitle">Has pulsado el sonido mortal</p>

  {#if $game.difficulty}
    <div style="margin: 2rem 0;">
      <p style="font-size: 1.2rem;">Nivel alcanzado: <strong>{$game.currentLevelIndex + 1}</strong></p>
      <p style="font-size: 1.1rem; color: var(--text-secondary); margin-top: 0.5rem;">
        Progreso: {$game.correctPressed} / {
          $game.difficulty === 'easy' ? [3, 4, 5, 6, 7, 7][$game.currentLevelIndex] || 7 :
          $game.difficulty === 'medium' ? [4, 5, 6, 7, 7][$game.currentLevelIndex] || 7 :
          [5, 6, 7, 7][$game.currentLevelIndex] || 7
        }
      </p>
    </div>
  {/if}

  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <button
      class="btn btn-primary"
      on:click={retry}
      disabled={!canRetry}
      style:opacity={canRetry ? 1 : 0.5}
    >
      {canRetry ? '🔄 REINTENTAR' : '🔊 Esperando sonido...'}
    </button>
    <button class="btn btn-primary" on:click={handleShare} style:background={shareSuccess ? 'var(--accent-success)' : ''}>
      {shareText}
    </button>
    <button class="btn btn-secondary" on:click={goToMenu}>
      🏠 INICIO
    </button>
  </div>
</div>
