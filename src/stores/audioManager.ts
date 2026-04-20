// Gestor de audios que nunca repite hasta agotar todos
// Persistente entre niveles, dificultades y partidas

const BASE_PATH = import.meta.env.BASE_URL || '/juego-sonidos/';

// Configuración de audios
export const AUDIO_CONFIG = {
  normalCount: 53,  // Cantidad total de audios normales
  errorCount: 6,    // Audios de error (siempre fijos)
  maxNormalCount: 100,
};

export class AudioManager {
  private currentPool: number[] = [];
  private errorPool: number[] = [];

  constructor() {
    this.resetPools();
  }

  private resetPools() {
    // Crear pool de índices normales (1 a normalCount)
    this.currentPool = this.shuffle(
      Array.from({ length: AUDIO_CONFIG.normalCount }, (_, i) => i + 1)
    );

    // Pool de errores
    this.errorPool = this.shuffle(
      Array.from({ length: AUDIO_CONFIG.errorCount }, (_, i) => i + 1)
    );

    console.log('🔄 AudioManager reiniciado. Pool normal:', this.currentPool.length);
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Obtiene múltiples URLs de sonidos normales
  getNormalSounds(count: number): string[] {
    const sounds: string[] = [];

    for (let i = 0; i < count; i++) {
      if (this.currentPool.length === 0) {
        // Reiniciar SOLO cuando se agoten todos los audios
        console.log('🔄 ¡Todos los audios reproducidos! Reiniciando pool...');
        this.resetPools();
      }
      const index = this.currentPool.pop()!;
      sounds.push(`${BASE_PATH}sounds/${index}.mp3`);
    }

    console.log(`🔊 Obtenidos ${count} sonidos. Pool restante: ${this.currentPool.length}`);
    return sounds;
  }

  // Obtiene URL de sonido de error (aleatorio, sin afectar el pool normal)
  getErrorSound(): string {
    const index = this.errorPool[Math.floor(Math.random() * this.errorPool.length)];
    return `${BASE_PATH}sounds/Error${index}.mp3`;
  }

  // Reinicio completo (solo cuando se agotan todos)
  forceReset() {
    this.resetPools();
    console.log('🔄 Reinicio forzado de AudioManager');
  }

  // Estadísticas
  getStats() {
    return {
      remainingNormal: this.currentPool.length,
      totalNormal: AUDIO_CONFIG.normalCount,
      playedNormal: AUDIO_CONFIG.normalCount - this.currentPool.length,
      errorCount: AUDIO_CONFIG.errorCount,
    };
  }
}

// Instancia global y PERSISTENTE
export const audioManager = new AudioManager();
