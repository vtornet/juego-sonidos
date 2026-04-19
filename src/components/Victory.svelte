<script lang="ts">
  import { game } from '../stores/game';

  function playAgain() {
    game.retry();
  }

  function goToMenu() {
    game.goToMenu();
  }

  $: elapsed = $game.startTime > 0 ? Math.round((Date.now() - $game.startTime) / 1000) : 0;
</script>

<div class="card" style="text-align: center;">
  <h1 class="title" style="color: var(--accent-success);">🏆 ¡VICTORIA! 🏆</h1>

  <p class="subtitle">Has superado todos los niveles</p>

  <div style="margin: 2rem 0;">
    <p style="font-size: 1.5rem; margin-bottom: 1rem;">
      Dificultad: <strong style="color: var(--accent);">
        {$game.difficulty === 'easy' ? '🔰 FÁCIL' : $game.difficulty === 'medium' ? '🔥 MEDIO' : '💀 DIFÍCIL'}
      </strong>
    </p>
    <p style="font-size: 1.2rem; color: var(--text-secondary);">
      Tiempo: <strong>{elapsed}</strong> segundos
    </p>
  </div>

  <div style="display: flex; flex-direction: column; gap: 1rem;">
    <button class="btn btn-success" on:click={playAgain}>
      🔄 JUGAR OTRA VEZ
    </button>
    <button class="btn btn-secondary" on:click={goToMenu}>
      🏠 INICIO
    </button>
  </div>
</div>
