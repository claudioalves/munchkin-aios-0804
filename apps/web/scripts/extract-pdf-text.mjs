// Extrai o texto de todos os PDFs listados em public/regras-munchkin/manifest.json
// e grava public/regras-munchkin/texts.json (id -> texto). Rode de novo sempre que
// adicionar/trocar um PDF: node scripts/extract-pdf-text.mjs
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rulesDir = path.join(__dirname, '..', 'public', 'regras-munchkin');

async function extractText(filePath) {
  const data = new Uint8Array(await readFile(filePath));
  const doc = await getDocument({ data, useWorkerFetch: false, isEvalSupported: false }).promise;
  const pages = [];

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
    pages.push(text);
  }

  return pages.join('\n\n');
}

async function main() {
  const manifest = JSON.parse(await readFile(path.join(rulesDir, 'manifest.json'), 'utf8'));
  const texts = {};

  for (const file of manifest.files) {
    process.stdout.write(`Extraindo: ${file.filename}... `);
    const text = await extractText(path.join(rulesDir, file.filename));
    texts[file.id] = text;
    console.log(`ok (${text.length} caracteres)`);
  }

  await writeFile(path.join(rulesDir, 'texts.json'), JSON.stringify(texts), 'utf8');
  console.log(`\nSalvo em ${path.join(rulesDir, 'texts.json')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
