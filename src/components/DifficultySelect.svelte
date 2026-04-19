<script lang="ts">
  import { game } from '../stores/game';

  function selectDifficulty(difficulty: 'easy' | 'medium' | 'hard') {
    game.startGame(difficulty);
  }
</script>

<div class="card">
  <h1 class="title">🔊 SONIDO MORTAL</h1>
  <p class="subtitle">Selecciona dificultad:</p>

  <button class="difficulty-btn difficulty-easy" on:click={() => selectDifficulty('easy')}>
    🔰 FÁCIL
    <span style="font-size: 0.9rem; opacity: 0.8;">6 niveles • Para empezar</span>
  </button>

  <button class="difficulty-btn difficulty-medium" on:click={() => selectDifficulty('medium')}>
    🔥 MEDIO
    <span style="font-size: 0.9rem; opacity: 0.8;">5 niveles • Todo un reto</span>
  </button>

  <button class="difficulty-btn difficulty-hard" on:click={() => selectDifficulty('hard')}>
    💀 DIFÍCIL
    <span style="font-size: 0.9rem; opacity: 0.8;">4 niveles • Solo expertos</span>
  </button>
</div>
