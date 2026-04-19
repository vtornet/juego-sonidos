<script lang="ts">
  import { game } from '../stores/game';

  function nextLevel() {
    game.nextLevel();
  }
</script>

<div class="card level-complete">
  <h1 class="title">✅ ¡Nivel Completado!</h1>

  {#if $game.difficulty}
    <p class="subtitle">
      Has superado el nivel {$game.currentLevelIndex + 1}
      en dificultad {$game.difficulty === 'easy' ? 'Fácil' : $game.difficulty === 'medium' ? 'Medio' : 'Difícil'}
    </p>
  {/if}

  <button class="btn btn-success" on:click={nextLevel}>
    Siguiente Nivel →
  </button>
</div>

<style>
  .level-complete {
    text-align: center;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
