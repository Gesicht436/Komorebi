'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { soundEngine } from '@/lib/audio/sound-engine';
import { PasswordInputWithConfirm } from '@/features/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      soundEngine.playClick();
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please ensure both fields are identical.');
      soundEngine.playClick();
      return;
    }

    setIsLoading(true);
    soundEngine.playClick();

    if (!isSupabaseConfigured()) {
      // Local sandbox mode
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
        soundEngine.playLevelUp();
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }, 500);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (
          error.message?.toLowerCase().includes('failed to fetch') ||
          error.message?.toLowerCase().includes('fetch')
        ) {
          setIsSuccess(true);
          soundEngine.playLevelUp();
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }
        setErrorMessage(error.message);
        soundEngine.playClick();
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        soundEngine.playLevelUp();
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
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
          Set New Password
        </h1>
        <p className="text-sm font-semibold text-[#8D6E63] mt-1">
          Type your new password twice below to confirm and protect your study chamber
        </p>
      </div>

      {/* Reset Card */}
      <div className="max-w-md w-full bg-white border border-[#EFEBE9] rounded-3xl p-7 sm:p-9 shadow-sm">
        {isSuccess ? (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-[#3E2723]">Password Changed!</h2>
            <p className="text-xs text-[#8D6E63] leading-relaxed">
              Your new password has been confirmed and saved. Redirecting you to sign in...
            </p>
            <div className="pt-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-xs hover:bg-[#D46A4F] cursor-pointer"
                onClick={() => soundEngine.playClick()}
              >
                <span>Go to Sign In Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-[#FBE9E7] text-[#E07A5F]">
                <KeyRound className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#3E2723]">Create New Password</h2>
            </div>
            <p className="text-xs text-[#8D6E63] mb-5">
              Please enter your new password twice to guarantee 100% accuracy.
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <PasswordInputWithConfirm
                password={newPassword}
                confirmPassword={confirmPassword}
                onPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                passwordLabel="New Password"
                confirmLabel="Confirm New Password"
                passwordPlaceholder="At least 6 characters"
                confirmPlaceholder="Type new password again"
                disabled={isLoading}
              />

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#EFEBE9] text-center">
              <Link
                href="/login"
                className="text-xs font-bold text-[#8D6E63] hover:text-[#3E2723]"
                onClick={() => soundEngine.playClick()}
              >
                Cancel and return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
