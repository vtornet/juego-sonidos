// Utilidad para compartir resultados

export interface ShareData {
  difficulty: string;
  level: number;
  time: number;
  result: 'victory' | 'gameover';
}

export function generateShareText(data: ShareData): string {
  const difficultyNames = {
    easy: '🔰 Fácil',
    medium: '🔥 Medio',
    hard: '💀 Difícil'
  };

  const diffName = difficultyNames[data.difficulty as keyof typeof difficultyNames] || data.difficulty;

  if (data.result === 'victory') {
    return `🏆 ¡HE SUPERADO SONIDO MORTAL!\n\n` +
      `Dificultad: ${diffName}\n` +
      `Tiempo: ${data.time} segundos\n` +
      `¿Eres capaz de superarlo?\n\n` +
      `🎮 https://vtornet.github.io/juego-sonidos/`;
  } else {
    return `💀 GAME OVER en SONIDO MORTAL\n\n` +
      `Dificultad: ${diffName}\n` +
      `Llegué al nivel ${data.level}\n\n` +
      `¿Puedes llegar más lejos?\n\n` +
      `🎮 https://vtornet.github.io/juego-sonidos/`;
  }
}

export async function shareResult(data: ShareData): Promise<boolean> {
  const text = generateShareText(data);

  // Usar Web Share API si está disponible
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Sonido Mortal',
        text: text
      });
      return true;
    } catch (err) {
      console.log('Share cancelled or failed:', err);
      return false;
    }
  }

  // Fallback: copiar al portapapeles
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

export function canUseNativeShare(): boolean {
  return !!navigator.share;
}
