/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly R2_PUBLIC_URL: string;
  readonly ADMIN_PASSWORD?: string;
  readonly JWT_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}