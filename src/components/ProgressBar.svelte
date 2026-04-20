<script lang="ts">
  export let current: number;
  export let total: number;
  export let level: number;
  export let difficulty: 'easy' | 'medium' | 'hard' = 'easy';

  const difficultyConfig = {
    easy: { name: 'FÁCIL', emoji: '🔰', color: '#00d9a5' },
    medium: { name: 'MEDIO', emoji: '🔥', color: '#ffd369' },
    hard: { name: 'DIFÍCIL', emoji: '💀', color: '#ff6b6b' }
  };

  $: diffConfig = difficultyConfig[difficulty];
  $: percentage = (current / total) * 100;
  $: remaining = total - current;
</script>

<div class="progress-container">
  <!-- Nivel y Dificultad -->
  <div class="header-row">
    <div class="level-badge" style="border-color: {diffConfig.color}">
      <span class="level-emoji">{diffConfig.emoji}</span>
      <span class="level-text">{diffConfig.name}</span>
    </div>
    <div class="level-number">
      Nivel {level}
    </div>
  </div>

  <!-- Contador principal animado -->
  <div class="counter-display">
    <div class="counter-item current">
      <span class="counter-value">{current}</span>
      <span class="counter-label">Completados</span>
    </div>
    <div class="counter-divider">/</div>
    <div class="counter-item total">
      <span class="counter-value">{total}</span>
      <span class="counter-label">Objetivo</span>
    </div>
    <div class="counter-remaining">
      Faltan <span class="remaining-number">{remaining}</span>
    </div>
  </div>

  <!-- Barra de progreso mejorada -->
  <div class="progress-bar-wrapper">
    <div class="progress-bar">
      <div class="progress-fill" style="width: {percentage}%; background: linear-gradient(90deg, {diffConfig.color}, {diffConfig.color}99)"></div>
    </div>
    <div class="progress-percentage">{Math.round(percentage)}%</div>
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .level-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-tertiary);
    border-radius: 20px;
    border: 2px solid;
    font-weight: 600;
  }

  .level-emoji {
    font-size: 1.2rem;
  }

  .level-text {
    font-size: 0.9rem;
    color: var(--text-primary);
  }

  .level-number {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .counter-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--bg-tertiary);
    border-radius: 16px;
    margin-bottom: 1rem;
  }

  .counter-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .counter-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .current .counter-value {
    color: var(--accent-success);
    animation: pulse 0.3s ease;
  }

  .total .counter-value {
    color: var(--text-secondary);
  }

  .counter-label {
    font-size: 0.7rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .counter-divider {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-secondary);
    opacity: 0.3;
  }

  .counter-remaining {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }

  .remaining-number {
    font-weight: 700;
    color: var(--accent);
  }

  .progress-bar-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .progress-bar {
    flex: 1;
    height: 12px;
    background: var(--bg-secondary);
    border-radius: 6px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.5s ease;
  }

  .progress-percentage {
    font-weight: 600;
    color: var(--text-secondary);
    min-width: 3rem;
    text-align: right;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  /* Móvil */
  @media (max-width: 480px) {
    .counter-value {
      font-size: 1.5rem;
    }

    .counter-display {
      padding: 0.75rem;
      gap: 0.5rem;
    }

    .counter-label {
      font-size: 0.6rem;
    }
  }
</style>
