/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Origin of the backend API server, e.g. https://api.truecleankc.com */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
