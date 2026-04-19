/// <reference types="vite/client" />

declare namespace svelte.JSX {
  interface HTMLAttributes {
    class?: string;
    style?: string;
  }
}

interface Window {
  workbox: any;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.Mp3' {
  const src: string;
  export default src;
}

declare module '*.MP3' {
  const src: string;
  export default src;
}

declare module '*.ogg' {
  const src: string;
  export default src;
}

declare module '*.wav' {
  const src: string;
  export default src;
}
