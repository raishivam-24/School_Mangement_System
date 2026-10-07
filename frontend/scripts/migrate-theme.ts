/**
 * Theme migration script: Replaces hardcoded Tailwind color classes with semantic token classes
 * across all TSX files in the pages and components directories.
 * 
 * Run with: node --experimental-strip-types scripts/migrate-theme.ts
 * Or: npx tsx scripts/migrate-theme.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_DIR = path.resolve(__dirname, '../src/pages');
const COMPONENTS_DIR = path.resolve(__dirname, '../src/components');

// Map of old class patterns → new semantic class patterns
const replacements: [RegExp, string][] = [
  // ── Background colors ──
  [/\bbg-white\b/g, 'bg-surface'],
  [/\bbg-surface\b(?![-/])/g, 'bg-surface'],  // already correct, skip
  
  // Slate backgrounds → semantic
  [/\bbg-slate-50\b/g, 'bg-surface-raised'],
  [/\bbg-slate-100\b/g, 'bg-surface-raised'],
  
  // ── Text colors ──
  [/\btext-slate-900\b/g, 'text-primary'],
  [/\btext-slate-800\b/g, 'text-primary'],
  [/\btext-slate-700\b/g, 'text-secondary'],
  [/\btext-slate-600\b/g, 'text-secondary'],
  [/\btext-slate-500\b/g, 'text-secondary'],
  [/\btext-slate-400\b/g, 'text-muted'],
  [/\btext-slate-300\b/g, 'text-muted'],
  
  // ── Border colors ──
  [/\bborder-slate-100\b/g, 'border-border'],
  [/\bborder-slate-200\b/g, 'border-border'],
  [/\bborder-slate-300\b/g, 'border-border-dark'],
  
  // ── Brand → Accent mappings ──
  // Sky → Blue
  [/\btext-brand-sky-dark\b/g, 'text-accent-blue'],
  [/\btext-brand-sky\b/g, 'text-accent-blue'],
  [/\bbg-brand-sky-light\b/g, 'bg-accent-blue-subtle'],
  [/\bbg-brand-sky\b(?!-)/g, 'bg-accent-blue'],
  
  // Mint → Green
  [/\btext-brand-mint-dark\b/g, 'text-accent-green'],
  [/\btext-brand-mint\b/g, 'text-accent-green'],
  [/\bbg-brand-mint-light\b/g, 'bg-accent-green-subtle'],
  [/\bbg-brand-mint\b(?!-)/g, 'bg-accent-green'],
  
  // Rose → Rose  
  [/\btext-brand-rose-dark\b/g, 'text-accent-rose'],
  [/\btext-brand-rose\b/g, 'text-accent-rose'],
  [/\bbg-brand-rose-light\b/g, 'bg-accent-rose-subtle'],
  [/\bbg-brand-rose\b(?!-)/g, 'bg-accent-rose'],
  
  // Yellow → Amber
  [/\btext-brand-yellow-dark\b/g, 'text-accent-amber'],
  [/\btext-brand-yellow\b/g, 'text-accent-amber'],
  [/\bbg-brand-yellow-light\b/g, 'bg-accent-amber-subtle'],
  [/\bbg-brand-yellow\b(?!-)/g, 'bg-accent-amber'],
  
  // Lilac → Violet
  [/\btext-brand-lilac-dark\b/g, 'text-accent-violet'],
  [/\btext-brand-lilac\b/g, 'text-accent-violet'],
  [/\bbg-brand-lilac-light\b/g, 'bg-accent-violet-subtle'],
  [/\bbg-brand-lilac\b(?!-)/g, 'bg-accent-violet'],
  
  // ── Shadow ──
  [/\bshadow-card\b/g, 'shadow-card'],  // already correct
  [/\bshadow-soft\b/g, 'shadow-card'],
  
  // ── Hover states on slate ──
  [/\bhover:bg-slate-100\b/g, 'hover:bg-surface-raised'],
  [/\bhover:bg-slate-50\b/g, 'hover:bg-surface-raised'],
  [/\bhover:text-slate-900\b/g, 'hover:text-primary'],
  [/\bhover:text-slate-800\b/g, 'hover:text-primary'],
  [/\bhover:border-brand-sky\b/g, 'hover:border-accent-blue'],
  
  // ── Focus ring ──
  [/\bfocus:ring-brand-sky\/30\b/g, 'focus:ring-accent-blue/30'],
  [/\bfocus:border-brand-sky\b/g, 'focus:border-accent-blue'],
];

function migrateFile(filePath: string): { changes: number; fileName: string } {
  let content = fs.readFileSync(filePath, 'utf-8');
  let totalChanges = 0;
  
  for (const [pattern, replacement] of replacements) {
    const matches = content.match(pattern);
    if (matches) {
      // Don't replace if already has the correct class
      if (matches[0] !== replacement) {
        totalChanges += matches.length;
        content = content.replace(pattern, replacement);
      }
    }
  }
  
  if (totalChanges > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return { changes: totalChanges, fileName: path.basename(filePath) };
}

function walkDir(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

// Run migration
console.log('🎨 SchoolHub Theme Migration Script');
console.log('====================================\n');

const files = [...walkDir(PAGES_DIR, '.tsx'), ...walkDir(COMPONENTS_DIR, '.tsx')];
let totalChanged = 0;

for (const file of files) {
  const { changes, fileName } = migrateFile(file);
  if (changes > 0) {
    console.log(`✅ ${fileName}: ${changes} replacements`);
    totalChanged += changes;
  } else {
    console.log(`⏭️  ${fileName}: no changes needed`);
  }
}

console.log(`\n====================================`);
console.log(`🎉 Migration complete: ${totalChanged} total replacements across ${files.length} files`);
