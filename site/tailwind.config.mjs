/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // V06 — Editorial Luxury (OKLCH-based, tinted neutrals toward warm earth)
        ink:        'oklch(0.27 0.04 248)',  // Tiefblau-Tinte (Headlines, Anker)
        cream:      'oklch(0.97 0.018 78)',  // Warmes Papier (Hauptgrund)
        charcoal:   'oklch(0.32 0.012 60)',  // Fließtext mit minimaler Wärme
        terracotta: 'oklch(0.62 0.135 52)',  // Wirkungsakzent (Buttons, Marker)
        sage:       'oklch(0.72 0.04 145)',  // Beruhigung (Block-Hintergründe)
        marine:     'oklch(0.62 0.07 220)',  // Frische (italic Markers)
        linen:      'oklch(0.87 0.02 78)',   // Hairlines, dezente Rahmen

        // Alias fürs alte Token-Schema
        tinte: 'oklch(0.27 0.04 248)',
        pergament: 'oklch(0.97 0.018 78)',
        anthrazit: 'oklch(0.32 0.012 60)',
        kupfer: 'oklch(0.62 0.135 52)',
        salbei: 'oklch(0.72 0.04 145)',
        quellwasser: 'oklch(0.62 0.07 220)',
        holzsand: 'oklch(0.87 0.02 78)',
      },
      fontFamily: {
        // V06 Typografie: Instrument Serif (Display) + Geist (Body)
        serif: ['"Instrument Serif"', 'Cormorant Garamond', 'Georgia', 'ui-serif', 'serif'],
        sans:  ['"Geist Variable"', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial Hierarchie — >=1.25 ratio
        'hero':     ['clamp(3.5rem, 9vw, 7.5rem)',     { lineHeight: '0.95', letterSpacing: '-0.025em' }],
        'section':  ['clamp(2.5rem, 4.5vw, 4rem)',     { lineHeight: '1.0',  letterSpacing: '-0.02em'  }],
        'sub':      ['clamp(1.25rem, 1.8vw + 0.4rem, 1.7rem)', { lineHeight: '1.35' }],
        'eyebrow':  ['0.74rem',                         { lineHeight: '1', letterSpacing: '0.22em' }],
        'numeral':  ['clamp(4rem, 7vw, 7rem)',          { lineHeight: '0.85', letterSpacing: '-0.045em' }],
      },
      transitionTimingFunction: {
        // Emil-Kowalski-Skill: starke custom easings (kein eingebautes ease-in)
        'out-strong': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'inout-strong': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '160': '160ms',
        '240': '240ms',
        '720': '720ms',
      },
    },
  },
  plugins: [],
};
