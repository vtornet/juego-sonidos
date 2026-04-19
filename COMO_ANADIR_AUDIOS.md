# 🎵 Cómo añadir más audios al juego

## Pasos simples:

1. **Coloca los nuevos archivos MP3** en:
   ```
   public/sounds/
   ```

2. **Nombra los archivos** secuencialmente:
   - Los siguientes serían `43.mp3`, `44.mp3`, `45.mp3`, etc.
   - NO modifiques los archivos Error1-6.mp3

3. **Actualiza la configuración** en `src/stores/audioManager.ts`:
   ```typescript
   export const AUDIO_CONFIG = {
     normalCount: 50,  // Cambia 42 por tu nueva cantidad
     errorCount: 6,    // NO cambiar
     maxNormalCount: 100,
   };
   ```

4. **Compila y despliega**:
   ```bash
   npm run build
   git add .
   git commit -m "Add more sounds"
   git push
   ```

## ¡Listo!

El juego reproducirá automáticamente todos los audios (incluyendo los nuevos) de forma aleatoria y sin repetir ninguno hasta que se agoten todos.

No necesitas cambiar nada más del código.
