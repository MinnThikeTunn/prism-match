import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export const Route = createFileRoute('/auth')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Sign in — Matchwise Prism' },
      {
        name: 'description',
        content:
          'Create your Matchwise Prism account or sign in to run the onboarding questionnaire and get context-aware matches.',
      },
      { property: 'og:title', content: 'Sign in — Matchwise Prism' },
      {
        property: 'og:description',
        content: 'Create an account to build your Prism profile and discover context-aware matches.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: AuthPage,
});

type Mode = 'signin' | 'signup' | 'forgot';

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/app', replace: true });
    });
  }, [navigate]);

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
            data: { full_name: name || email.split('@')[0] },
          },
        });
        if (err) throw err;
        if (data.session) {
          navigate({ to: '/app', replace: true });
        } else {
          setNotice('Account created. Check your inbox and click the confirmation link to continue.');
        }
      } else if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: '/app', replace: true });
      } else {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setNotice('Password reset link sent. Check your inbox.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97706] via-rose-500 to-indigo-600" />
            <span className="text-lg font-extrabold tracking-tight text-stone-900">Matchwise Prism</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            {mode === 'signup' ? 'Create your account' : mode === 'signin' ? 'Welcome back' : 'Reset your password'}
          </h1>
          <p className="text-xs text-stone-500 mt-1.5">
            {mode === 'signup'
              ? 'New accounts start with the 10-step onboarding questionnaire.'
              : mode === 'signin'
                ? 'Sign in to your Prism profile and matches.'
                : "We'll email you a link to set a new password."}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4"
        >
          {mode === 'signup' && (
            <label className="block">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Display name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className="mt-1.5 w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706]"
              />
            </label>
          )}

          <label className="block">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1.5 w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706]"
            />
          </label>

          {mode !== 'forgot' && (
            <label className="block">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Password</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                className="mt-1.5 w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706]"
              />
            </label>
          )}

          {error && (
            <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          {notice && (
            <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
              {notice}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white text-sm font-bold transition-colors"
          >
            {busy
              ? 'Working…'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Send reset link'}
          </button>

          <div className="flex items-center justify-between pt-1 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setError(null);
                setNotice(null);
              }}
              className="text-stone-700 hover:text-[#D97706]"
            >
              {mode === 'signup' ? 'I already have an account' : 'Create an account'}
            </button>
            {mode !== 'forgot' && (
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setError(null);
                  setNotice(null);
                }}
                className="text-stone-500 hover:text-[#D97706]"
              >
                Forgot password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
