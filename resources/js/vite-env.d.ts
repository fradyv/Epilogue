/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string;
    readonly VITE_BOT_CHAIN_ID: string;
    readonly VITE_BOT_CHAIN_RPC: string;
    readonly VITE_EPILOGUE_CONTRACT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
