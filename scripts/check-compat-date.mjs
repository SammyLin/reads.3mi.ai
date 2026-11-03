#!/usr/bin/env node
// Astro 4 + Pages SSR 的 compatibility_date 只能是 2025-09-01:2026-01-01 會讓 SSR 回 [object Object]
// (修過兩次:news d0bdf52、trending d2e8e46)。日期只寫在 wrangler.toml,package.json 不准再用 flag 覆寫。
// 升到 Astro 5+ 後重新評估,能用新日期就刪掉這個檢查。
import { readFileSync } from 'node:fs';

const WANT = '2025-09-01';
const pkgText = readFileSync('package.json', 'utf8');
const pkg = JSON.parse(pkgText);
const astro = { ...pkg.dependencies, ...pkg.devDependencies }.astro ?? '';
if (!/^[\^~]?4\./.test(astro)) {
  console.warn(`check-compat-date: astro 是 ${astro},不是 4.x;確認新日期沒問題後刪掉這個檢查。`);
  process.exit(0);
}

const errors = [];
const date = readFileSync('wrangler.toml', 'utf8').match(/^compatibility_date\s*=\s*"([^"]+)"/m)?.[1];
if (date !== WANT) {
  errors.push(`wrangler.toml 的 compatibility_date 是 ${date ?? '(沒寫)'},改回 "${WANT}"(Astro 4 SSR 在 2026-01-01 會回 [object Object])。`);
}
if (pkgText.includes('--compatibility-date')) {
  errors.push('package.json 的 script 帶了 --compatibility-date:刪掉 flag,日期只留在 wrangler.toml。');
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
