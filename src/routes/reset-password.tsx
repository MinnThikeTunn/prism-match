import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export const Route = createFileRoute('/reset-password')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Set a new password — Matchwise Prism' },
      {
        name: 'description',
        content: 'Choose a new password for your Matchwise Prism account.',
      },
      { property: 'og:title', content: 'Set a new password — Matchwise Prism' },
      { property: 'og:description', content: 'Choose a new password for your Matchwise Prism account.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => navigate({ to: '/app', replace: true }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex items-center justify-center p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4"
      >
        <h1 className="text-xl font-extrabold text-stone-900 tracking-tight">Set a new password</h1>
        <p className="text-xs text-stone-500">
          Open this page from the reset link in your email, then choose a new password.
        </p>

        <label className="block">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">New password</span>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-1.5 w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706]/30 focus:border-[#D97706]"
          />
        </label>

        {error && (
          <p className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}
        {done && (
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
            Password updated. Taking you to the app…
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white text-sm font-bold transition-colors"
        >
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
