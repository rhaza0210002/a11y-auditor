'use client';

import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 py-4" role="banner">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:rounded-md"
          aria-label="A11yAuditor - Retour à l'accueil"
        >
          A11y<span className="text-white">Auditor</span>
        </Link>
        
        <nav role="navigation" aria-label="Navigation principale">
          <Link
            href="/auth"
            className="rounded-md bg-indigo-600/10 border border-indigo-500/30 px-4 py-2 text-sm font-semibold text-indigo-400 transition-all hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  );
}