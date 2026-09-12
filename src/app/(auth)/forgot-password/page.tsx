'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { soundEngine } from '@/lib/audio/sound-engine';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSandboxMode, setIsSandboxMode] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    soundEngine.playClick();

    if (!isSupabaseConfigured()) {
      setIsSandboxMode(true);
      setIsSubmitted(true);
      setIsLoading(false);
      soundEngine.playQuestComplete();
      return;
    }

    try {
      const supabase = createClient();
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/reset-password`,
      });

      if (error) {
        if (
          error.message?.toLowerCase().includes('failed to fetch') ||
          error.message?.toLowerCase().includes('fetch')
        ) {
          setIsSandboxMode(true);
          setIsSubmitted(true);
          soundEngine.playQuestComplete();
          return;
        }
        setErrorMessage(error.message);
        soundEngine.playClick();
      } else {
        setIsSubmitted(true);
        soundEngine.playQuestComplete();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to request password reset';
      if (msg.toLowerCase().includes('fetch')) {
        setIsSandboxMode(true);
        setIsSubmitted(true);
        soundEngine.playQuestComplete();
        return;
      }
      setErrorMessage(msg);
    } finally {
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
          Recover Scholar Access
        </h1>
        <p className="text-sm font-semibold text-[#8D6E63] mt-1">
          Enter your registered email to reset your study chamber password
        </p>
      </div>

      {/* Forgot Password Card */}
      <div className="max-w-md w-full bg-white border border-[#EFEBE9] rounded-3xl p-7 sm:p-9 shadow-sm">
        {isSubmitted ? (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#3E2723]">Check Your Email</h2>

            {isSandboxMode ? (
              <div className="p-3.5 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] text-[#B78103] text-xs text-left">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-[#F57F17]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Local Sandbox Simulation</span>
                </div>
                <p>
                  Since you are currently in Local Sandbox mode, you can directly proceed to set a new password without needing an email inbox.
                </p>
                <div className="mt-3">
                  <Link
                    href="/reset-password"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white text-xs font-bold shadow-xs cursor-pointer"
                    onClick={() => soundEngine.playClick()}
                  >
                    <span>Proceed to Reset Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#8D6E63] leading-relaxed">
                If an account exists for <span className="font-bold text-[#3E2723]">{email}</span>, we have dispatched a password recovery magic link to it. Please check your inbox and spam folder.
              </p>
            )}

            <div className="pt-4 border-t border-[#EFEBE9]">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E07A5F] hover:text-[#D46A4F]"
                onClick={() => soundEngine.playClick()}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-[#3E2723] mb-1">Forgot Password?</h2>
            <p className="text-xs text-[#8D6E63] mb-5">
              Don&apos;t worry! Enter your email below and we will help you regain entry to your study room.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Sending Link...' : 'Send Recovery Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#EFEBE9] text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8D6E63] hover:text-[#3E2723]"
                onClick={() => soundEngine.playClick()}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
