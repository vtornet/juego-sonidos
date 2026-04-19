<script lang="ts">
  import { game } from './stores/game';
  import DifficultySelect from './components/DifficultySelect.svelte';
  import GameBoard from './components/GameBoard.svelte';
  import LevelComplete from './components/LevelComplete.svelte';
  import GameOver from './components/GameOver.svelte';
  import Victory from './components/Victory.svelte';
</script>

<main>
  {#if $game.state === 'menu'}
    <DifficultySelect />
  {:else if $game.state === 'playing'}
    <GameBoard />
  {:else if $game.state === 'levelComplete'}
    <LevelComplete />
  {:else if $game.state === 'gameover'}
    <GameOver />
  {:else if $game.state === 'victory'}
    <Victory />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
</style>
