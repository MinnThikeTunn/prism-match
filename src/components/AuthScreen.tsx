import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../lib/useAuth';
import { lovable } from '../integrations/lovable';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) navigate({ to: '/', replace: true });
  }, [loading, session, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    try {
      if (mode === 'signup') {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (err) throw err;
        if (!data.session) {
          setNotice('Check your inbox and confirm your email to finish creating your account.');
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 mb-2">
            Matchwise Prism
          </div>
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Your profile, onboarding answers and match signals sync securely to the cloud.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4"
        >
          {mode === 'signup' && (
            <label className="block">
              <span className="text-xs font-medium text-stone-600">Display name</span>
              <div className="mt-1 flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-stone-900">
                <UserIcon className="w-4 h-4 text-stone-400" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 outline-none text-sm bg-transparent"
                  placeholder="Ada Lovelace"
                />
              </div>
            </label>
          )}

          <label className="block">
            <span className="text-xs font-medium text-stone-600">Email</span>
            <div className="mt-1 flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-stone-900">
              <Mail className="w-4 h-4 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="flex-1 outline-none text-sm bg-transparent"
                placeholder="you@example.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-xs font-medium text-stone-600">Password</span>
            <div className="mt-1 flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-stone-900">
              <Lock className="w-4 h-4 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="flex-1 outline-none text-sm bg-transparent"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-stone-900 text-white rounded-xl py-3 text-sm font-medium hover:bg-stone-800 disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400">or</span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              const result = await lovable.auth.signInWithOAuth('google', {
                redirect_uri: window.location.origin,
              });
              if (result.error) {
                setError(result.error.message ?? 'Google sign-in failed');
                setBusy(false);
                return;
              }
              if (result.redirected) return;
              navigate({ to: '/', replace: true });
            }}
            className="w-full flex items-center justify-center gap-2 border border-stone-300 rounded-xl py-3 text-sm font-medium text-stone-800 hover:bg-stone-50 disabled:opacity-60"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z" />
              <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
              <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
              <path fill="#EA4335" d="M12 4.8c1.8 0 3.4.7 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
              setNotice(null);
            }}
            className="w-full text-sm text-stone-500 hover:text-stone-900"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
