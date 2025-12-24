/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BETWIZ_API_URL?: string;
  readonly VITE_BET360_UI_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
