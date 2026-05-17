/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // V05 — Editorial Warm
        ink: '#1B2837',            // Dunkler Anker (Headlines, Footer, hervorgehobene Wörter)
        cream: '#FBF6EB',          // Heller warmer Grundton (Papier-Anmutung)
        charcoal: '#2A2A2A',       // Fließtext (weicher als reines Schwarz)
        terracotta: '#B5673A',     // Wirkungsakzent (Buttons, Highlights — erdiger als V01-Kupfer)
        sage: '#94A493',           // Beruhigungsakzent (Block-Hintergründe, Marker)
        marine: '#5C8E9F',         // Frische-Akzent (interaktive Hover, Section-Marker)
        linen: '#DDCCB1',          // Neutralton (Trennlinien, Karten-Rahmen)

        // Aliase fürs alte Token-Namensschema (damit Komponenten nicht alle umbenannt werden müssen)
        tinte: '#1B2837',
        pergament: '#FBF6EB',
        anthrazit: '#2A2A2A',
        kupfer: '#B5673A',
        salbei: '#94A493',
        quellwasser: '#5C8E9F',
        holzsand: '#DDCCB1',
      },
      fontFamily: {
        // V05 Typografie: Newsreader (Display) + Manrope (Body)
        serif: ['"Newsreader Variable"', 'Newsreader', 'Georgia', 'ui-serif', 'serif'],
        sans: ['"Manrope Variable"', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial Typografie-Skala
        'hero': ['clamp(3rem, 7.5vw, 6.25rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'section': ['clamp(2.25rem, 4vw, 3.5rem)', { lineHeight: '1.05', letterSpacing: '-0.018em' }],
        'sub': ['clamp(1.25rem, 1.6vw + 0.5rem, 1.6rem)', { lineHeight: '1.35', letterSpacing: '-0.005em' }],
        'eyebrow': ['0.74rem', { lineHeight: '1', letterSpacing: '0.22em' }],
        'numeral': ['clamp(3.5rem, 6vw, 5.5rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(27, 40, 55, 0.04)',
        'card-hover': '0 18px 40px -20px rgba(27, 40, 55, 0.16)',
      },
    },
  },
  plugins: [],
};
