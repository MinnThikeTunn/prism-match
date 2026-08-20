import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../lib/useAuth';

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
