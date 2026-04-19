// Gestor de audios que mezcla sin repetir hasta agotar todos
// Se expande automáticamente al añadir más archivos

const BASE_PATH = import.meta.env.BASE_URL || '/juego-sonidos/';

// Configuración de audios - añade más aquí para expandir
export const AUDIO_CONFIG = {
  // Audios normales (se irán añadiendo)
  normalCount: 42,  // Cantidad de audios normales (1.mp3 - 42.mp3)

  // Audios de error (siempre fijos a 6 por diseño)
  errorCount: 6,    // Error1.mp3 - Error6.mp3

  // Se puede expandir esto en el futuro sin cambiar el código
  maxNormalCount: 100,  // Límite superior para expansión futura
};

export class AudioManager {
  private usedNormalIndices: Set<number> = new Set();
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

    // Pool de errores siempre fijo
    this.errorPool = this.shuffle(
      Array.from({ length: AUDIO_CONFIG.errorCount }, (_, i) => i + 1)
    );
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Obtiene la URL de un sonido normal (sin repetir hasta agotar)
  getNormalSound(): string {
    if (this.currentPool.length === 0) {
      // Reiniciar pool cuando se agoten todos
      console.log('🔄 Reiniciando pool de audios normales');
      this.resetPools();
    }

    const index = this.currentPool.pop()!;
    return `${BASE_PATH}sounds/${index}.mp3`;
  }

  // Obtiene múltiples URLs de sonidos normales
  getNormalSounds(count: number): string[] {
    const sounds: string[] = [];

    for (let i = 0; i < count; i++) {
      if (this.currentPool.length === 0) {
        // Reiniciar si se agota
        console.log('🔄 Reiniciando pool de audios normales');
        this.resetPools();
      }
      const index = this.currentPool.pop()!;
      sounds.push(`${BASE_PATH}sounds/${index}.mp3`);
    }

    return sounds;
  }

  // Obtiene URL de sonido de error (aleatorio)
  getErrorSound(): string {
    const index = this.errorPool[Math.floor(Math.random() * this.errorPool.length)];
    return `${BASE_PATH}sounds/Error${index}.mp3`;
  }

  // Reinicia todos los pools (nueva partida)
  reset() {
    this.usedNormalIndices.clear();
    this.resetPools();
    console.log('🔄 AudioManager reiniciado');
  }

  // Estadísticas
  getStats() {
    return {
      remainingNormal: this.currentPool.length,
      totalNormal: AUDIO_CONFIG.normalCount,
      errorCount: AUDIO_CONFIG.errorCount,
    };
  }
}

// Instancia global
export const audioManager = new AudioManager();
