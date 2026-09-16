import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Brutalism has no soft corners. Overriding (not extending) the scale means
    // any stray `rounded-*` left in the tree renders square instead of leaking
    // the old glass look back in.
    borderRadius: {
      none: '0',
      sm: '0',
      DEFAULT: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '0',
    },
    extend: {
      colors: {
        // Every token resolves through a CSS var, so light/dark flips once in
        // globals.css instead of doubling every className with a dark: variant.
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-dim': 'var(--ink-dim)',
        'ink-faint': 'var(--ink-faint)',
        rule: 'var(--rule)',
        'rule-soft': 'var(--rule-soft)',
        accent: 'var(--accent)',
        'accent-ink': 'var(--accent-ink)',
        ok: 'var(--ok)',
        info: 'var(--info)',
      },
      borderColor: {
        DEFAULT: 'var(--rule)',
      },
      fontFamily: {
        // One typeface, everywhere. Terminal brutalism doesn't switch faces.
        sans: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        label: '0.18em',
      },
      screens: {
        w450: { raw: '(max-width: 450px)' },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
export default config
