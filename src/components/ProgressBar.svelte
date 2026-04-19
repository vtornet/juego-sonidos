<script lang="ts">
  export let current: number;
  export let total: number;
  export let level: number;

  const percentage = (current / total) * 100;
</script>

<div class="level-badge">Nivel {level}</div>
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
  <span>🎯 {current} / {total}</span>
  <span>{Math.round(percentage)}%</span>
</div>
<div class="progress-bar">
  <div class="progress-fill" style="width: {percentage}%"></div>
</div>
