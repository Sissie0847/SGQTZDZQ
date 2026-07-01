/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Source Serif 4"', '"Source Serif Pro"', '"Songti SC"', 'STSong', 'Georgia', 'serif'],
        body: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Cascadia Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          DEFAULT: '#ededed',
          dim: '#9a9a9a',
          faint: '#5e5e5e',
        },
        paper: {
          DEFAULT: '#0a0a0a',
          card: '#161616',
          line: '#2a2a2a',
        },
        accent: {
          DEFAULT: '#4ec9d6',
          warm: '#d4a373',
        },
      },
    },
  },
  plugins: [],
};
