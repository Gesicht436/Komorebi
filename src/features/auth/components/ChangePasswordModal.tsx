'use client';

import React, { useState } from 'react';
import { X, KeyRound, Check, AlertCircle, Sparkles } from 'lucide-react';
import { PasswordInputWithConfirm } from './PasswordInputWithConfirm';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { soundEngine } from '@/lib/audio/sound-engine';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

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
      // Local sandbox mode: update mock session
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage('Password updated successfully in your local browser sandbox!');
        soundEngine.playQuestComplete();
        setTimeout(() => {
          onClose();
          setNewPassword('');
          setConfirmPassword('');
          setSuccessMessage('');
        }, 1500);
      }, 500);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setErrorMessage(error.message);
        soundEngine.playClick();
      } else {
        setSuccessMessage('Your password has been successfully changed!');
        soundEngine.playQuestComplete();
        setTimeout(() => {
          onClose();
          setNewPassword('');
          setConfirmPassword('');
          setSuccessMessage('');
        }, 1800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update password';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#3E2723]">
            <div className="p-2 rounded-xl bg-[#FBE9E7] text-[#E07A5F]">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Change Password</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8D6E63] hover:text-[#3E2723] rounded-xl hover:bg-[#F5EFEB] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#8D6E63] mb-5">
          Enter your new password twice below to ensure you have typed it accurately.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInputWithConfirm
            password={newPassword}
            confirmPassword={confirmPassword}
            onPasswordChange={setNewPassword}
            onConfirmPasswordChange={setConfirmPassword}
            passwordLabel="New Password"
            confirmLabel="Confirm New Password"
            passwordPlaceholder="At least 6 characters"
            confirmPlaceholder="Re-type new password"
            disabled={isLoading || Boolean(successMessage)}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFEBE9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#8D6E63] hover:text-[#3E2723] rounded-xl hover:bg-[#F5EFEB] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || Boolean(successMessage)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#D46A4F] text-white font-bold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isLoading ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
