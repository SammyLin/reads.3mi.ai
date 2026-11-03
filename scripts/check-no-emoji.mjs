#!/usr/bin/env node
// UI 不准出現 emoji(慣例見 CLAUDE.md)。prebuild 會跑,本機 build 和部署 build 都擋。
// 只掃 UI 程式碼;文章標題/內文在資料庫或 .md 裡,不在掃描範圍。console.* 那幾行不算 UI。
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const ROOTS = ["src"];
const HINT = "Astro 元件用 lucide-astro;runtime 拼出來的字串用 inline Lucide SVG,照 src/lib/categoryIcon.ts 的做法。";
const EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.css', '.html']);
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{25B6}\u{25C0}\u{FE0F}]/u;

const walk = (p) => (statSync(p).isDirectory() ? readdirSync(p).flatMap((n) => walk(join(p, n))) : [p]);
const hits = [];
for (const file of ROOTS.flatMap(walk)) {
  if (!EXTS.has(extname(file))) continue;
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (EMOJI.test(line) && !/console\.(log|info|warn|error)/.test(line)) {
      hits.push(`  ${file}:${i + 1}: ${line.trim().slice(0, 100)}`);
    }
  });
}
if (hits.length) {
  console.error(`UI 不能用 emoji 或裝飾符號,改用 lucide 圖示。${HINT}\n${hits.join('\n')}`);
  process.exit(1);
}
