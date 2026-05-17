/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // V03 — Pine Sage Monochrome (palette inspired by ziga reference)
        // Token names preserved (tinte/kupfer/salbei/...) so components don't need code changes
        tinte: '#2C3E36',        // Pine Dark — Headlines, Footer, dunkler Anker
        pergament: '#FEFCF7',    // Off-White — Grundton (unverändert)
        anthrazit: '#2A2E2C',    // Pine Anthracite — Fließtext, leicht grün-gestimmt
        kupfer: '#3A574A',       // Pine Medium — Wirkungsakzent / Buttons, monochrom grün
        salbei: '#B6CFB0',       // Sage Mint — Marker, Punkte, Akzentdetails
        quellwasser: '#86A89A',  // Sage Teal — Resonanz, Hover, analytisches Signal
        holzsand: '#D2D3BB',     // Sage Beige — Hairlines, Card-Borders
      },
      fontFamily: {
        serif: ['"Fraunces Variable"', 'Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Hero H1
        'hero': ['clamp(2.25rem, 4.5vw + 1rem, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        // Section H2
        'section': ['clamp(1.75rem, 2vw + 1rem, 2.75rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        // Sub-Headline
        'sub': ['clamp(1.125rem, 0.5vw + 1rem, 1.375rem)', { lineHeight: '1.4' }],
        // Eyebrow
        'eyebrow': ['0.78rem', { lineHeight: '1.2', letterSpacing: '0.18em' }],
      },
      maxWidth: {
        'prose-narrow': '45rem', // ~720px
        'prose-wide': '70rem',
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      boxShadow: {
        'card': '0 1px 4px 0 rgba(44, 62, 54, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(44, 62, 54, 0.08)',
      },
      transitionTimingFunction: {
        'quiet': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
};
