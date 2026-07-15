import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'A11yAuditor - Optimisez l\'accessibilité de votre site',
  description: 'Analysez, suivez et corrigez les problèmes d\'accessibilité de votre site web.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-50 antialiased`}>
        {/* Skip Link pour l'accessibilité au clavier */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Aller au contenu principal
        </a>

        <div className="flex min-h-screen flex-col">
          <Header />

          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>

          <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-sm text-slate-500" role="contentinfo">
            <div className="container mx-auto px-4">
              <p>&copy; {new Date().getFullYear()} A11yAuditor. Tous droits réservés.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}