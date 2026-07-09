#!/usr/bin/env node
/**
 * copy-homepage.mjs
 *
 * Kopiert die als Hauptseite markierte Standalone-Variante nach
 * <SITE_DIR>/index.html, sodass die Pages-Root-URL
 * (https://jgc-coding.github.io/jgc-studio-website/) die Hauptseite serviert.
 *
 * Welche Variante die Hauptseite ist, steht als Single Source of Truth im
 * Manifest (variants/standalone/manifest.json): der Eintrag mit "homepage": true.
 *
 * Aufruf in der GitHub Action:
 *   node scripts/copy-homepage.mjs <SITE_DIR> [MANIFEST_PATH]
 *
 * Defaults: SITE_DIR = "_site", MANIFEST_PATH = "variants/standalone/manifest.json".
 *
 * Die Galerie selbst wird von scripts/generate-gallery.mjs erzeugt und liegt
 * unter <SITE_DIR>/galerie/index.html.
 */

import { copyFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE_DIR = process.argv[2] || '_site';
const MANIFEST_PATH = process.argv[3] || join('variants', 'standalone', 'manifest.json');

async function main() {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`Manifest nicht gefunden: ${MANIFEST_PATH}`);
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  } catch (err) {
    console.error(`Manifest konnte nicht gelesen werden (${MANIFEST_PATH}): ${err.message}`);
    process.exit(1);
  }

  const homepageSlugs = Object.entries(manifest)
    .filter(([, meta]) => meta && meta.homepage === true)
    .map(([slug]) => slug);

  if (homepageSlugs.length === 0) {
    console.error(
      `Kein Manifest-Eintrag mit "homepage": true gefunden (${MANIFEST_PATH}). ` +
        'Genau ein Eintrag muss die Hauptseite markieren.'
    );
    process.exit(1);
  }
  if (homepageSlugs.length > 1) {
    console.error(
      `Mehrere Manifest-Einträge mit "homepage": true gefunden: ${homepageSlugs.join(', ')}. ` +
        'Es darf genau eine Hauptseite geben.'
    );
    process.exit(1);
  }

  const slug = homepageSlugs[0];
  const srcPath = join('variants', 'standalone', slug, 'index.html');
  if (!existsSync(srcPath)) {
    console.error(`Quelldatei der Hauptseiten-Variante fehlt: ${srcPath}`);
    process.exit(1);
  }

  const destPath = join(SITE_DIR, 'index.html');
  await copyFile(srcPath, destPath);
  console.log(`✓ Hauptseite "${slug}" kopiert: ${srcPath} → ${destPath}`);
}

main().catch((err) => {
  console.error('Kopieren der Hauptseite fehlgeschlagen:', err);
  process.exit(1);
});
