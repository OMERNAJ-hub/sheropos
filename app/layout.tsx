import './globals.css';
import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import Header from '@/components/header';

const cairo = Cairo({ 
  subsets: ['arabic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: '$_𝓢𝓱𝓮𝓻𝓸𝓩𝓪𝓔𝓭 𝓒𝓬𝓱 𝓐𝓘',
  description: 'Smart POS System with AI Detection',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
        <div className="min-h-screen bg-slate-900">
          <Header />
          <main className="container mx-auto px-4 pt-24">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
