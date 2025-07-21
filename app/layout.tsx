import './globals.css';
import type {Metadata} from 'next';
import {Sora, Roboto_Mono} from 'next/font/google';
import {cn} from '@/lib/utils';
import {Toaster} from '@/components/ui/sonner';

const sans = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PIX | Prefeitura de Tupaciguara',
  description: 'Monitoramento PIX da Prefeitura de Tupaciguara.',
  keywords: ['PIX', 'pagamentos', 'QR code', 'fintech', 'Brasil', 'pagamentos instantâneos', 'cobrança', 'transações'],
  authors: [{ name: 'RTech' }],
  creator: 'RTech',
  publisher: 'RTech',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        sans.variable,
        mono.variable
      )}>
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}