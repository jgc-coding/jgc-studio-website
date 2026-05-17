/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tinte: '#1F2A44',
        pergament: '#FEFCF7',
        anthrazit: '#2D2D2D',
        kupfer: '#C97B3F',
        salbei: '#8FA98A',
        quellwasser: '#6FA3B5',
        holzsand: '#D9C7A8',
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
        'card': '0 1px 4px 0 rgba(31, 42, 68, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(31, 42, 68, 0.08)',
      },
      transitionTimingFunction: {
        'quiet': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
  plugins: [],
};
