#!/usr/bin/env node
/**
 * generate-gallery.mjs
 *
 * Generiert eine Landing-Page (_site/index.html), die alle gebauten
 * Varianten als Galerie auflistet, mit Thumbnail (Desktop-Screenshot)
 * und Link zur Live-Variante.
 *
 * Aufruf in der GitHub Action:
 *   node scripts/generate-gallery.mjs <SITE_DIR> <BASE_URL>
 *
 * Erwartete SITE_DIR-Struktur:
 *   <SITE_DIR>/
 *     main/                           ← Build des main-Branches
 *     variants/<slug>/                ← Builds der variant/*-Branches
 *     variants/screenshots/<slug>-desktop.png  ← Vorab existierende Captures
 *
 * BASE_URL ist der Pages-Pfad-Prefix, z.B. "/jgc-studio-website/"
 */

import { readdir, writeFile, copyFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const SITE_DIR = process.argv[2] || '_site';
const BASE = (process.argv[3] || '/').replace(/\/+$/, '') + '/';

async function listVariantSlugs() {
  const variantsDir = join(SITE_DIR, 'variants');
  if (!existsSync(variantsDir)) return [];
  const entries = await readdir(variantsDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name !== 'screenshots')
    .map((e) => e.name)
    .sort();
}

function variantTitle(slug) {
  // "01-briefing-v5-naturwarm-restraint" → "Variante 01 — Briefing V5 Naturwarm Restraint"
  const m = slug.match(/^(\d+)-(.+)$/);
  if (!m) return slug;
  const num = m[1];
  const rest = m[2]
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { num, label: rest, slug };
}

async function findScreenshot(slug, variant_dir) {
  // Look for screenshot in <SITE_DIR>/variants/screenshots/<slug>-desktop.png
  const expectedPath = join(SITE_DIR, 'variants', 'screenshots', `${slug.replace(/^(\d+)-.+$/, '$1')}-desktop.png`);
  if (existsSync(expectedPath)) {
    return `${BASE}variants/screenshots/${slug.replace(/^(\d+)-.+$/, '$1')}-desktop.png`;
  }
  // Fallback: numbered shortcut like "01-desktop.png"
  return null;
}

async function build() {
  const slugs = await listVariantSlugs();
  console.log(`Found ${slugs.length} variant(s): ${slugs.join(', ')}`);

  const mainExists = existsSync(join(SITE_DIR, 'main', 'index.html'));

  const variants = await Promise.all(
    slugs.map(async (slug) => {
      const t = variantTitle(slug);
      const screenshot = await findScreenshot(slug);
      return {
        slug,
        num: t.num || '–',
        label: t.label || slug,
        href: `${BASE}variants/${slug}/`,
        screenshot,
      };
    })
  );

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { background-color: #FEFCF7; color: #2D2D2D; font-family: ui-sans-serif, system-ui, sans-serif; }
    body { min-height: 100vh; padding: clamp(2rem, 5vw, 5rem) clamp(1.5rem, 4vw, 3rem); }
    .wrap { max-width: 1200px; margin: 0 auto; }
    header { margin-bottom: clamp(3rem, 5vw, 5rem); }
    .eyebrow {
      text-transform: uppercase; letter-spacing: 0.18em; font-size: 0.78rem;
      color: #C97B3F; font-weight: 500; margin-bottom: 1.25rem;
    }
    h1 {
      font-family: 'Fraunces', 'Times New Roman', serif;
      font-size: clamp(2rem, 4vw, 3rem);
      color: #1F2A44; line-height: 1.1; letter-spacing: -0.015em;
      font-weight: 500;
      max-width: 30ch;
    }
    .lede {
      margin-top: 1.25rem; max-width: 60ch; line-height: 1.65;
      color: rgba(45, 45, 45, 0.78); font-size: 1.0625rem;
    }
    .meta {
      margin-top: 2rem; display: flex; gap: 1.5rem; flex-wrap: wrap;
      font-size: 0.86rem; color: rgba(45, 45, 45, 0.55);
    }
    .meta a { color: inherit; border-bottom: 1px solid rgba(201, 123, 63, 0.6); padding-bottom: 1px; text-decoration: none; transition: color 160ms ease; }
    .meta a:hover { color: #C97B3F; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: clamp(1.25rem, 2vw, 2rem);
    }
    .card {
      background: #fff; border: 1px solid #D9C7A8; border-radius: 6px;
      overflow: hidden; display: flex; flex-direction: column;
      transition: transform 350ms cubic-bezier(0.32, 0.72, 0, 1),
                  box-shadow 350ms cubic-bezier(0.32, 0.72, 0, 1),
                  border-color 350ms ease;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px -16px rgba(31, 42, 68, 0.18);
      border-color: rgba(201, 123, 63, 0.55);
    }
    .card a.thumb {
      display: block; aspect-ratio: 4 / 3; overflow: hidden;
      background: linear-gradient(135deg, #FEFCF7 0%, rgba(217, 199, 168, 0.4) 100%);
      border-bottom: 1px solid #D9C7A8;
    }
    .card a.thumb img {
      display: block; width: 100%; height: 100%;
      object-fit: cover; object-position: top center;
      transition: transform 8s linear;
    }
    .card:hover a.thumb img { transform: translateY(calc(-100% + 240px)); }
    .card .thumb-empty {
      display: flex; align-items: center; justify-content: center;
      width: 100%; height: 100%;
      color: rgba(31, 42, 68, 0.35);
      font-family: 'Fraunces', serif; font-style: italic; font-size: 1rem;
    }
    .card .body { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; gap: 0.65rem; }
    .card .num {
      font-family: 'Fraunces', serif; font-style: italic;
      color: rgba(31, 42, 68, 0.45);
      font-size: 0.88rem;
    }
    .card h3 {
      font-family: 'Fraunces', serif; font-weight: 500;
      color: #1F2A44; font-size: 1.25rem; line-height: 1.25;
    }
    .card .slug-code {
      margin-top: auto; padding-top: 1rem;
      font-family: ui-monospace, monospace; font-size: 0.78rem;
      color: rgba(45, 45, 45, 0.55);
      word-break: break-all;
    }
    .card .actions {
      display: flex; gap: 0.75rem; margin-top: 1rem;
      padding-top: 1rem; border-top: 1px solid rgba(217, 199, 168, 0.6);
    }
    .card .actions a {
      text-decoration: none; font-size: 0.92rem; font-weight: 500;
      padding: 0.55rem 1rem; border-radius: 4px;
      transition: background-color 180ms ease, color 180ms ease;
    }
    .card .actions .primary {
      background: #C97B3F; color: #FEFCF7;
    }
    .card .actions .primary:hover { background: #B96D34; }
    .card .actions .ghost {
      color: #1F2A44; border: 1px solid rgba(31, 42, 68, 0.25);
    }
    .card .actions .ghost:hover { border-color: #1F2A44; }
    footer {
      margin-top: clamp(3rem, 5vw, 5rem);
      padding-top: 1.5rem; border-top: 1px solid #D9C7A8;
      font-size: 0.82rem; color: rgba(45, 45, 45, 0.5);
      display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
    }
    .main-link { display: inline-flex; align-items: center; gap: 0.5rem; }
    .main-link::before {
      content: ''; display: inline-block; width: 8px; height: 8px;
      border-radius: 50%; background: #8FA98A;
    }
    @media (prefers-color-scheme: dark) {
      html { background-color: #1F2A44; color: rgba(254, 252, 247, 0.85); }
      h1 { color: #FEFCF7; }
      .lede { color: rgba(254, 252, 247, 0.7); }
      .card { background: rgba(254, 252, 247, 0.04); border-color: rgba(217, 199, 168, 0.2); }
      .card h3 { color: #FEFCF7; }
      .card .num { color: rgba(254, 252, 247, 0.5); }
      .card .slug-code { color: rgba(254, 252, 247, 0.5); }
      .card .actions { border-top-color: rgba(217, 199, 168, 0.15); }
      .card .actions .ghost { color: #FEFCF7; border-color: rgba(254, 252, 247, 0.3); }
    }
  `;

  const cardsHtml = variants
    .map(
      (v) => `
    <article class="card">
      <a class="thumb" href="${v.href}" aria-label="Variante ${v.num} ansehen">
        ${
          v.screenshot
            ? `<img src="${v.screenshot}" alt="Screenshot Variante ${v.num}" loading="lazy" />`
            : `<span class="thumb-empty">noch ohne Screenshot</span>`
        }
      </a>
      <div class="body">
        <span class="num">Variante ${v.num}</span>
        <h3>${v.label}</h3>
        <code class="slug-code">${v.slug}</code>
        <div class="actions">
          <a class="primary" href="${v.href}">Live ansehen →</a>
          <a class="ghost" href="https://github.com/jgc-coding/jgc-studio-website/tree/variant/${v.slug}" target="_blank" rel="noopener noreferrer">Code</a>
        </div>
      </div>
    </article>`
    )
    .join('\n');

  const mainCardHtml = mainExists
    ? `
    <article class="card" style="border-color: rgba(143, 169, 138, 0.5); background: linear-gradient(180deg, #fff 0%, rgba(143, 169, 138, 0.06) 100%);">
      <a class="thumb" href="${BASE}main/" aria-label="Aktuelle Hauptversion ansehen">
        <span class="thumb-empty">aktuelle Hauptversion</span>
      </a>
      <div class="body">
        <span class="num main-link">main</span>
        <h3>Aktuell beschlossene Version</h3>
        <code class="slug-code">branch: main</code>
        <div class="actions">
          <a class="primary" href="${BASE}main/">Live ansehen →</a>
          <a class="ghost" href="https://github.com/jgc-coding/jgc-studio-website" target="_blank" rel="noopener noreferrer">Repo</a>
        </div>
      </div>
    </article>`
    : '';

  const html = `<!doctype html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>JGC Studio — Design-Varianten Galerie</title>
  <meta name="description" content="Übersicht aller Design-Varianten der JGC Studio Sales-Page." />
  <meta name="robots" content="noindex" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500&family=Inter:wght@400;500&display=swap" rel="stylesheet" />
  <style>${css}</style>
</head>
<body>
  <div class="wrap">
    <header>
      <p class="eyebrow">JGC Studio · Design-Exploration</p>
      <h1>Varianten-Galerie</h1>
      <p class="lede">
        Alle erkundeten Design-Richtungen für die Sales-Page, automatisch
        gebaut aus den <code>variant/*</code>-Branches des Repos.
        Klicke auf eine Karte, um die Live-Variante in voller Größe zu sehen.
      </p>
      <p class="meta">
        <span><strong>${variants.length}</strong> Variante${variants.length === 1 ? '' : 'n'} aktiv</span>
        <a href="https://github.com/jgc-coding/jgc-studio-website" target="_blank" rel="noopener noreferrer">Repo auf GitHub</a>
        <a href="https://github.com/jgc-coding/jgc-studio-website/blob/main/VARIANTS.md" target="_blank" rel="noopener noreferrer">Register (VARIANTS.md)</a>
      </p>
    </header>

    <section class="grid">
      ${mainCardHtml}
      ${cardsHtml}
    </section>

    <footer>
      <span>© ${new Date().getFullYear()} JGC Studio · Freiburg im Breisgau</span>
      <span>Automatisch generiert · <code>scripts/generate-gallery.mjs</code></span>
    </footer>
  </div>
</body>
</html>`;

  await writeFile(join(SITE_DIR, 'index.html'), html, 'utf8');
  console.log(`✓ Galerie geschrieben nach ${join(SITE_DIR, 'index.html')} (${variants.length} Variante(n))`);
}

build().catch((err) => {
  console.error('Galerie-Generierung fehlgeschlagen:', err);
  process.exit(1);
});
