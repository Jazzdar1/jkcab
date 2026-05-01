import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src';
const BAD_PATTERNS = [/^diff --git /m, /^index [0-9a-f]{7,}/m, /^--- a\//m, /^\+\+\+ b\//m, /^@@ /m];
const ALLOWED_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.css', '.html']);

function walk(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      walk(fullPath);
      continue;
    }

    const ext = fullPath.slice(fullPath.lastIndexOf('.'));
    if (!ALLOWED_EXT.has(ext)) continue;

    const content = readFileSync(fullPath, 'utf8');
    if (BAD_PATTERNS.some((pattern) => pattern.test(content))) {
      console.error(`Patch artifact detected in ${fullPath}. Remove accidentally pasted git diff content before building.`);
      process.exit(1);
    }
  }
}

walk(ROOT);
console.log('Source validation passed.');
