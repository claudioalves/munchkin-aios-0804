import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useGameStore, signInWithEmail, signUpWithEmail, signInWithGoogle } from '@munchkin/shared';

type Mode = 'login' | 'signup';

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUserId } = useGameStore();

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        void navigate('/');
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, setUserId]);

  async function handleGoogle() {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle(supabase, window.location.origin);
      // O Supabase redireciona para Google — onAuthStateChange cuida do resto
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar com Google');
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let user;
      if (mode === 'login') {
        user = await signInWithEmail(supabase, email, password);
      } else {
        user = await signUpWithEmail(supabase, email, password);
      }
      setUserId(user.id);
      void navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface-card border border-brand-gold rounded-2xl p-8 space-y-6">
        <header className="text-center space-y-1">
          <h1 className="font-display text-4xl text-brand-gold">Munchkin</h1>
          <p className="font-heading text-parchment-muted tracking-widest text-xs uppercase">
            Level Tracker
          </p>
        </header>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-brand-border">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 font-heading text-sm font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-brand-gold text-surface-base'
                : 'bg-transparent text-parchment-muted hover:text-parchment'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-2 font-heading text-sm font-semibold transition-colors ${
              mode === 'signup'
                ? 'bg-brand-gold text-surface-base'
                : 'bg-transparent text-parchment-muted hover:text-parchment'
            }`}
          >
            Criar conta
          </button>
        </div>

        <button
          type="button"
          onClick={() => { void handleGoogle(); }}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-[--color-brand-border] bg-[--color-brand-bg] text-[--color-brand-text] hover:border-[--color-brand-gold] transition-colors disabled:opacity-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.08 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-3.59-13.46-8.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Entrar com Google
        </button>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-[--color-brand-border]" />
          <span className="text-xs text-[--color-brand-muted]">ou</span>
          <div className="flex-1 h-px bg-[--color-brand-border]" />
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block font-heading text-xs text-parchment-muted uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-base border border-brand-border rounded-lg px-4 py-3 text-parchment font-body text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block font-heading text-xs text-parchment-muted uppercase tracking-wider"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-base border border-brand-border rounded-lg px-4 py-3 text-parchment font-body text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm font-body text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-gold text-surface-base font-heading font-semibold py-3 rounded-xl hover:bg-brand-gold-light transition-colors shadow-glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Aguarde...'
              : mode === 'login'
                ? 'Entrar'
                : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
}
