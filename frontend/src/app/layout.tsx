import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FinRadar AI — Deepfake & Financial Fraud Detection',
  description:
    'Real-time, low-latency verification engine for regional short-form vertical videos detecting AI-manipulated media and financial fraud.',
  keywords: [
    'Deepfake Detection',
    'AI Fraud',
    'Financial Security',
    'Vertical Video Forensics',
    'ALGOTHON 26',
  ],
  authors: [{ name: 'Pawan Kumar M T' }, { name: 'Sachin M S' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0a0f] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-300 min-h-screen flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0f0f1a',
              color: '#e2e8f0',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.15)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
