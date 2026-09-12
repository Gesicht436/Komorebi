'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Mail, User, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { soundEngine } from '@/lib/audio/sound-engine';
import { createLocalScholarProfile } from '@/features/game-state/local-user';
import { PasswordInputWithConfirm } from '@/features/auth';

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEmailConfirmationSent, setIsEmailConfirmationSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Clear demo cookie when arriving at signup page
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.cookie = 'komorebi_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, []);

  const handleResendConfirmation = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      const supabase = createClient();
      await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
      });
      setResendSuccess(true);
      soundEngine.playQuestComplete();
    } catch {
      // Ignore or quiet fail
    } finally {
      setIsResending(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Clear demo cookie immediately before signing up
    if (typeof document !== 'undefined') {
      document.cookie = 'komorebi_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      soundEngine.playClick();
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please make sure both passwords are typed identically.');
      soundEngine.playClick();
      return;
    }

    setIsLoading(true);
    soundEngine.playClick();

    // If Supabase credentials are placeholder or unconfigured, register locally in sandbox mode
    if (!isSupabaseConfigured()) {
      createLocalScholarProfile(displayName, email);
      soundEngine.playLevelUp();
      router.push('/dashboard');
      router.refresh();
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim() || 'Cozy Scholar',
          },
        },
      });

      if (error) {
        // If network fetch fails (e.g. invalid Supabase domain / offline), fallback to local sandbox profile
        if (
          error.message?.toLowerCase().includes('failed to fetch') ||
          error.message?.toLowerCase().includes('fetch')
        ) {
          createLocalScholarProfile(displayName, email);
          soundEngine.playLevelUp();
          router.push('/dashboard');
          router.refresh();
          return;
        }

        setErrorMessage(error.message);
        setIsLoading(false);
        return;
      }

      // If session was established immediately:
      if (data?.session) {
        soundEngine.playLevelUp();
        router.push('/dashboard');
        router.refresh();
        return;
      }

      // If user was created but session is null, attempt immediate sign-in (e.g. auto-confirm trigger)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInData?.session) {
        soundEngine.playLevelUp();
        router.push('/dashboard');
        router.refresh();
        return;
      }

      // If email confirmation is required:
      if (signInError?.message?.toLowerCase().includes('email not confirmed')) {
        setIsEmailConfirmationSent(true);
        setIsLoading(false);
        return;
      }

      if (signInError) {
        setErrorMessage(signInError.message);
        setIsLoading(false);
        return;
      }

      soundEngine.playLevelUp();
      router.push('/dashboard');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      if (msg.toLowerCase().includes('fetch')) {
        createLocalScholarProfile(displayName, email);
        soundEngine.playLevelUp();
        router.push('/dashboard');
        router.refresh();
        return;
      }
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-[#FFFBF5]">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E07A5F] to-[#F4A261] text-white shadow-md shadow-[#E07A5F]/20 mb-4 animate-float">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3E2723] tracking-tight">
          Begin Your Quest
        </h1>
        <p className="text-sm font-semibold text-[#8D6E63] mt-1">
          Create your Komorebi scholar profile & receive 50 bonus coins
        </p>
      </div>

      {/* Signup Card */}
      <div className="max-w-md w-full bg-white border border-[#EFEBE9] rounded-3xl p-7 sm:p-9 shadow-sm">
        <h2 className="text-xl font-bold text-[#3E2723] mb-1">New Character Registration</h2>
        <p className="text-xs text-[#8D6E63] mb-4">
          Set up your scholar name and credentials to start your Life RPG journey.
        </p>

        {/* Informational Sandbox Badge if Supabase is placeholder */}
        {!isSupabaseConfigured() && (
          <div className="mb-5 p-3 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-[#B78103] text-xs flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#F57F17]" />
            <div>
              <span className="font-bold">Local Sandbox Active:</span> You can register with any name, email, and password. Data saves locally in your browser.
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isEmailConfirmationSent ? (
          <div className="text-center space-y-4 animate-fade-in py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Mail className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-[#3E2723]">Verify Your Scholar Email</h2>
            <p className="text-xs text-[#8D6E63] leading-relaxed">
              We've created your character and sent an activation link to <span className="font-bold text-[#3E2723]">{email}</span>. Click the link in your email to enter your study chamber.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-[#B78103] text-xs text-left">
              <div className="font-bold flex items-center gap-1.5 mb-1 text-[#F57F17]">
                <Info className="w-4 h-4 shrink-0" />
                <span>Next Step</span>
              </div>
              <p>
                Once verified, you will be directed straight to your study desk. If you don't see the email within a minute, please check your spam or promotions folder.
              </p>
            </div>

            {resendSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>A new confirmation link has been sent to your email!</span>
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <Link
                href="/login"
                onClick={() => soundEngine.playClick()}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
              >
                <span>Go to Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                disabled={isResending}
                onClick={handleResendConfirmation}
                className="w-full text-xs font-semibold text-[#8D6E63] hover:text-[#E07A5F] py-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isResending ? 'Resending email...' : "Didn't receive an email? Resend"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1.5">
                  Scholar Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Satsuki, Rin, Leo"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-[#D7CCC8] text-sm text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="scholar@lofi-study.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFFBF5] border border-[#D7CCC8] text-sm text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                </div>
              </div>

              <PasswordInputWithConfirm
                password={password}
                confirmPassword={confirmPassword}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                passwordLabel="Password"
                confirmLabel="Confirm Password"
                passwordPlaceholder="At least 6 characters"
                confirmPlaceholder="Re-enter your password"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Creating Character...' : 'Create Character & Start'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Instant Judge Demo Mode Button */}
            <div className="mt-5 pt-4 border-t border-[#EFEBE9]">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playLevelUp();
                  document.cookie = 'komorebi_demo=true; path=/; max-age=86400';
                  router.push('/dashboard');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FFF8E1] to-[#FBE9E7] border border-[#FFE082] text-[#E07A5F] hover:text-[#D46A4F] font-extrabold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F4A261] animate-pulse" />
                <span>One-Click Judge Tour (Instant Demo)</span>
              </button>
              <p className="text-[10px] text-center text-[#8D6E63] mt-1.5">
                Pre-loaded with Level 3 Scholar, unlocked Calico Cat, 5-day streak, and coins.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EFEBE9] text-center text-xs text-[#8D6E63]">
              Already have a character?{' '}
              <Link
                href="/login"
                className="font-bold text-[#E07A5F] hover:underline"
                onClick={() => soundEngine.playClick()}
              >
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
