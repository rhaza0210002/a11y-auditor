'use client';

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Références pour la navigation au clavier dans les onglets
  const loginTabRef = useRef<HTMLButtonElement>(null);
  const signupTabRef = useRef<HTMLButtonElement>(null);

  // Gestion de la navigation au clavier (Accessibilité WCAG pour les onglets)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (activeTab === 'login') {
        setActiveTab('signup');
        signupTabRef.current?.focus();
      } else {
        setActiveTab('login');
        loginTabRef.current?.focus();
      }
    }
  };

  // Réinitialiser les messages d'erreur/succès au changement d'onglet
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (activeTab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Connexion réussie ! Redirection...');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        setSuccessMsg('Inscription réussie ! Veuillez vérifier vos e-mails pour confirmer votre compte.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-900/40 p-8 backdrop-blur-md">
        
        {/* En-tête visible et accessible */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {activeTab === 'login' ? 'Connexion à votre espace' : 'Créer un compte'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {activeTab === 'login' 
              ? 'Accédez à vos audits d\'accessibilité' 
              : 'Commencez à optimiser vos projets dès aujourd\'hui'}
          </p>
        </div>

        {/* Système d'onglets accessible (Tabs Pattern) */}
        <div 
          role="tablist" 
          aria-label="Options d'authentification" 
          className="grid grid-cols-2 gap-2 rounded-lg bg-slate-950 p-1"
          onKeyDown={handleKeyDown}
        >
          <button
            ref={loginTabRef}
            role="tab"
            aria-selected={activeTab === 'login'}
            aria-controls="panel-login"
            id="tab-login"
            tabIndex={activeTab === 'login' ? 0 : -1}
            onClick={() => setActiveTab('login')}
            className={`rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              activeTab === 'login' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Se connecter
          </button>
          <button
            ref={signupTabRef}
            role="tab"
            aria-selected={activeTab === 'signup'}
            aria-controls="panel-signup"
            id="tab-signup"
            tabIndex={activeTab === 'signup' ? 0 : -1}
            onClick={() => setActiveTab('signup')}
            className={`rounded-md py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              activeTab === 'signup' 
                ? 'bg-indigo-600 text-white shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            S'enregistrer
          </button>
        </div>

        {/* Zone de notification dynamique pour les lecteurs d'écran (aria-live) */}
        <div aria-live="polite" className="space-y-4">
          {errorMsg && (
            <div id="auth-error" className="rounded-md bg-red-950/50 border border-red-500/30 p-4 text-sm text-red-400">
              <span className="font-semibold">Erreur :</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div id="auth-success" className="rounded-md bg-emerald-950/50 border border-emerald-500/30 p-4 text-sm text-emerald-400">
              {successMsg}
            </div>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>
          {activeTab === 'signup' && (
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-slate-300">
                Nom complet
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-slate-500" aria-hidden="true" />
                </div>
                <input
                  id="full-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-md border border-slate-800 bg-slate-950 py-3 pl-10 pr-3 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-slate-300">
              Adresse e-mail
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={errorMsg ? 'true' : 'false'}
                aria-describedby={errorMsg ? 'auth-error' : undefined}
                className="block w-full rounded-md border border-slate-800 bg-slate-950 py-3 pl-10 pr-3 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                placeholder="jean.dupont@exemple.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Mot de passe
            </label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-slate-500" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border border-slate-800 bg-slate-950 py-3 pl-10 pr-12 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-white focus:outline-none focus:text-indigo-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Chargement...' : activeTab === 'login' ? 'Se connecter' : "S'inscrire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}