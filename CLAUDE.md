# 🔊 SONIDO MORTAL - PWA de Juego de Sonidos

## Descripción del Proyecto

Progressive Web App (PWA) de un juego de sonidos donde el jugador debe pulsar botones con sonidos correctos evitando el "sonido mortal".

---

## Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Framework | Svelte + Vite + TypeScript | Ligero, reactividad simple, bundle pequeño ideal para PWA |
| PWA | vite-plugin-pwa | Service worker, manifest, offline mode automáticos |
| Audio | Howler.js | Robusto, cross-browser, preload de sonidos |
| Estilos | Tailwind CSS | Rápido de desarrollar, responsive |
| Deploy | GitHub Pages / Netlify | Gratis y simple |

---

## Dinámica del Juego

### Mecánica Base
1. Al iniciar partida, aparece un grid de botones con sonidos
2. Cada botón reproduce un sonido al pulsarlo
3. **Un botón es el "sonido mortal"** → pulsarlo = GAME OVER
4. Los botones correctos pulsados se **desactivan** (no se pueden volver a pulsar)
5. Al alcanzar la meta de correctos, **avanzas al siguiente nivel**

### Flujo de Estados

```
INICIO → Selección dificultad → NIVELES → VICTORIA / GAME OVER
```

### Estados del Botón
```
[Sin pulsar] ──► [Correcto ✓] ──► [Desactivado]
      │
      └──► [MORTAL ✗] ──► GAME OVER
```

---

## Niveles de Dificultad

### 🔰 FÁCIL (6 niveles)

| Nivel | Botones | Meta | Malos posibles | % Acierto |
|-------|---------|------|-----------------|-----------|
| 1 | 15 | 3 | 12 | 20% |
| 2 | 13 | 4 | 9 | 30% |
| 3 | 12 | 5 | 7 | 41% |
| 4 | 11 | 6 | 5 | 54% |
| 5 | 10 | 7 | 3 | 70% |
| 6 | 9 | 7 | 2 | 77% |

### 🔥 MEDIO (5 niveles)

| Nivel | Botones | Meta | Malos posibles | % Acierto |
|-------|---------|------|-----------------|-----------|
| 1 | 12 | 4 | 8 | 33% |
| 2 | 11 | 5 | 6 | 45% |
| 3 | 10 | 6 | 4 | 60% |
| 4 | 9 | 7 | 2 | 77% |
| 5 | 8 | 7 | 1 | 87% |

### 💀 DIFÍCIL (4 niveles)

| Nivel | Botones | Meta | Malos posibles | % Acierto |
|-------|---------|------|-----------------|-----------|
| 1 | 10 | 5 | 5 | 50% |
| 2 | 9 | 6 | 3 | 66% |
| 3 | 8 | 7 | 1 | 87% |
| 4 | 8 | 7 | 1 | 87% |

---

## Pantallas de la App

### 1. Pantalla Inicio
```
┌─────────────────────────────┐
│      🔊 SONIDO MORTAL       │
│                             │
│  Selecciona dificultad:     │
│                             │
│   [ 🔰 FÁCIL ]              │
│   6 niveles • Para empezar  │
│                             │
│   [ 🔥 MEDIO ]              │
│   5 niveles • Todo un reto  │
│                             │
│   [ 💀 DIFÍCIL ]            │
│   4 niveles • Solo expertos │
│                             │
│   [ 📊 Puntuaciones ]       │
└─────────────────────────────┘
```

### 2. Pantalla de Juego
```
┌─────────────────────────────┐
│  Nivel 3    🎯 4 / 7        │
│  ████████░░░░ 57%           │
├─────────────────────────────┤
│                             │
│  [ 🔔 ] [ 🎺 ] [ 🥁 ]       │
│  [ 🎸 ] [ 🎹 ] [ 🔊 ]       │
│  [ 🎤 ]                     │
│                             │
├─────────────────────────────┤
│  ¡Evita el SONIDO MORTAL!   │
└─────────────────────────────┘
```

### 3. GAME OVER
```
┌─────────────────────────────┐
│      💀 GAME OVER 💀        │
│                             │
│   Has pulsado el sonido     │
│   mortal en el nivel 3      │
│                             │
│   Nivel alcanzado: 3        │
│   Progreso: 4 / 7           │
│                             │
│   [ 🔄 REINTENTAR ]         │
│   [ 🏠 INICIO ]             │
└─────────────────────────────┘
```

### 4. VICTORIA
```
┌─────────────────────────────┐
│      🏆 ¡VICTORIA! 🏆       │
│                             │
│   Has superado todos los    │
│   niveles en dificultad     │
│   MEDIO                     │
│                             │
│   Tiempo: 45 segundos       │
│                             │
│   [ 🔄 JUGAR OTRA VEZ ]     │
│   [ 🏠 INICIO ]             │
└─────────────────────────────┘
```

---

## Configuración de Niveles (TypeScript)

```typescript
export const LEVELS = {
  easy: [
    { level: 1, totalButtons: 15, goal: 3 },
    { level: 2, totalButtons: 13, goal: 4 },
    { level: 3, totalButtons: 12, goal: 5 },
    { level: 4, totalButtons: 11, goal: 6 },
    { level: 5, totalButtons: 10, goal: 7 },
    { level: 6, totalButtons: 9,  goal: 7 },
  ],
  medium: [
    { level: 1, totalButtons: 12, goal: 4 },
    { level: 2, totalButtons: 11, goal: 5 },
    { level: 3, totalButtons: 10, goal: 6 },
    { level: 4, totalButtons: 9,  goal: 7 },
    { level: 5, totalButtons: 8,  goal: 7 },
  ],
  hard: [
    { level: 1, totalButtons: 10, goal: 5 },
    { level: 2, totalButtons: 9,  goal: 6 },
    { level: 3, totalButtons: 8,  goal: 7 },
    { level: 4, totalButtons: 8,  goal: 7 },
  ],
};

export type Difficulty = 'easy' | 'medium' | 'hard';
```

---

## Estructura de Archivos

```
src/
├── components/
│   ├── GameBoard.svelte    # Grid de botones con sonidos
│   ├── ProgressBar.svelte  # Progreso (4/7 pulsados)
│   ├── DifficultySelect.svelte # Selección de dificultad
│   ├── GameOver.svelte     # Pantalla GAME OVER
│   └── Victory.svelte      # Pantalla VICTORIA
├── stores/
│   └── game.ts             # Estado: nivel, progreso, dificultad, sonidos
├── assets/
│   └── sounds/             # Archivos de audio (.mp3 o .ogg)
├── App.svelte
├── main.ts
└── app.css
```

---

## Reglas Importantes

1. **El sonido mortal es aleatorio** en cada partida — no se puede memorizar
2. **Sin pistas visuales** — todos los botones parecen iguales
3. **Botones correctos se desactivan** tras ser pulsados
4. **Siempre hay 1 sonido mortal** mínimo (imposible meta = botones totales)
5. **Victoria** = completar todos los niveles de la dificultad
