// Recomprime/redimensiona fotos in-place pra reduzir peso sem perder qualidade
// percebida. Usa sharp (mozjpeg, qualidade 80, max 2000px de largura).
//
// Uso:
//   node scripts/optimize-photos.mjs                    # default: public/photos/galeria
//   node scripts/optimize-photos.mjs <pasta> [maxW]     # custom

import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const TARGET_DIR = process.argv[2] ?? "public/photos/galeria";
const MAX_WIDTH = Number(process.argv[3] ?? 2000);
const QUALITY = 80;

async function optimize(filePath) {
  const before = (await stat(filePath)).size;
  const tmpPath = filePath + ".tmp";

  const meta = await sharp(filePath).metadata();
  const needsResize = (meta.width ?? 0) > MAX_WIDTH;

  await sharp(filePath)
    .rotate() // honra orientação EXIF antes de stripar
    .resize({ width: needsResize ? MAX_WIDTH : meta.width, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmpPath);

  const after = (await stat(tmpPath)).size;

  // Só substitui se realmente reduziu (evita inflar arquivos já otimizados).
  if (after < before) {
    await unlink(filePath);
    await rename(tmpPath, filePath);
  } else {
    await unlink(tmpPath);
  }

  return { before, after, replaced: after < before, dims: { from: meta.width, to: needsResize ? MAX_WIDTH : meta.width } };
}

const dir = join(ROOT, TARGET_DIR);
const files = (await readdir(dir)).filter((f) => /\.(jpe?g)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

console.log(`\nOtimizando ${files.length} fotos em ${TARGET_DIR} (max ${MAX_WIDTH}px, q${QUALITY} mozjpeg)\n`);

for (const file of files) {
  const filePath = join(dir, file);
  const { before, after, replaced, dims } = await optimize(filePath);
  totalBefore += before;
  totalAfter += replaced ? after : before;

  const beforeKB = (before / 1024).toFixed(0);
  const afterKB = (after / 1024).toFixed(0);
  const delta = replaced ? `${(((before - after) / before) * 100).toFixed(0)}% menor` : "skip (já menor)";
  const dimNote = dims.from !== dims.to ? ` · ${dims.from}px→${dims.to}px` : "";
  console.log(`  ${file.padEnd(28)} ${beforeKB.padStart(5)}KB → ${afterKB.padStart(5)}KB  (${delta})${dimNote}`);
}

const totalBeforeMB = (totalBefore / 1024 / 1024).toFixed(2);
const totalAfterMB = (totalAfter / 1024 / 1024).toFixed(2);
const totalDelta = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(0);
console.log(`\nTotal: ${totalBeforeMB}MB → ${totalAfterMB}MB  (${totalDelta}% menor)\n`);
