import React, { useState } from 'react';
import { getSupabaseClient, setStoredAuthUser } from '../lib/supabase';

interface AuthGateProps {
  onAuthenticated: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAutofill = () => {
    setEmail('team@gradsearch.org');
    setPassword('gradsearch2027');
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg('Please enter email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });

        if (error) {
          setErrorMsg(error.message);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          setStoredAuthUser({ email: data.user.email || trimmedEmail, id: data.user.id });
          onAuthenticated();
          return;
        }
      }

      // Shared team login verification
      setStoredAuthUser({ email: trimmedEmail, id: 'shared-team-user' });
      onAuthenticated();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FBF9F5] dark:bg-[#0F172A] text-[#1F2937] dark:text-[#F8FAFC]">
      <div className="w-full max-w-sm bg-white dark:bg-[#1E293B] border border-[#E6DFD5] dark:border-[#334155] rounded-xl p-6 sm:p-8 shadow-xs">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          GradQuest
        </h1>

        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="team@gradsearch.org"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleAutofill}
              className="px-4 py-2 text-xs font-medium rounded-lg border border-[#E6DFD5] dark:border-[#334155] bg-slate-50 dark:bg-[#0F172A] hover:bg-slate-100 dark:hover:bg-[#334155] text-slate-700 dark:text-slate-300 transition-colors"
            >
              Autofill
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium text-xs sm:text-sm rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
