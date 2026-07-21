import {
  Cormorant_Garamond,
  IBM_Plex_Sans_KR,
  JetBrains_Mono,
  Noto_Sans_TC,
  Noto_Serif_KR,
  Noto_Serif_TC,
} from 'next/font/google';

const bodyKorean = IBM_Plex_Sans_KR({
  display: 'swap',
  preload: false,
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-kr-loaded',
});

const headingKorean = Noto_Serif_KR({
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-kr-loaded',
});

const headingTraditionalChinese = Noto_Serif_TC({
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-tc-loaded',
});

const bodyTraditionalChinese = Noto_Sans_TC({
  display: 'swap',
  preload: false,
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc-loaded',
});

const headingEnglish = Cormorant_Garamond({
  display: 'swap',
  preload: false,
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: 'normal',
  variable: '--font-cormorant-garamond-loaded',
});

const monospace = JetBrains_Mono({
  display: 'swap',
  preload: false,
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: 'normal',
  variable: '--font-jetbrains-mono-loaded',
});

export const siteFontVariables = [
  bodyKorean.variable,
  headingKorean.variable,
  headingTraditionalChinese.variable,
  bodyTraditionalChinese.variable,
  headingEnglish.variable,
  monospace.variable,
].join(' ');
