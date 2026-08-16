import type { Metadata, Viewport } from 'next';
import { Inter, Rubik } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/content';

const display = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const body = Rubik({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-rubik',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Детектор токсичности отношений — стоит ли возвращать бывшего',
  description:
    '15 вопросов — и честный ответ были ли ваши отношения токсичными. Нарциссизм, созависимость, газлайтинг. Бесплатный результат.',
  keywords: [
    'детектор токсичности отношений',
    'токсичные отношения тест',
    'нарциссизм в отношениях тест',
    'стоит ли возвращать бывшего',
    'газлайтинг тест',
    'созависимость тест',
    'красные флаги отношений тест',
  ],
  authors: [{ name: 'Евдокимов Даниил Владимирович' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: SITE.name,
    title: 'Детектор токсичности отношений',
    description: '15 вопросов и честный ответ — стоит ли возвращать.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Детектор токсичности отношений',
    description: '15 вопросов и честный ответ — стоит ли возвращать.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32x32.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0F0505',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
