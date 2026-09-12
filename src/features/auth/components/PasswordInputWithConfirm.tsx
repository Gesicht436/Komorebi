'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface PasswordInputWithConfirmProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (val: string) => void;
  onConfirmPasswordChange: (val: string) => void;
  passwordLabel?: string;
  confirmLabel?: string;
  passwordPlaceholder?: string;
  confirmPlaceholder?: string;
  disabled?: boolean;
}

export const PasswordInputWithConfirm: React.FC<PasswordInputWithConfirmProps> = ({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordLabel = 'Password',
  confirmLabel = 'Confirm Password',
  passwordPlaceholder = 'At least 6 characters',
  confirmPlaceholder = 'Re-enter your password',
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasTypedBoth = password.length > 0 && confirmPassword.length > 0;
  const isMatched = hasTypedBoth && password === confirmPassword;
  const isMismatched = hasTypedBoth && password !== confirmPassword;
  const isTooShort = password.length > 0 && password.length < 6;

  return (
    <div className="space-y-4">
      {/* Primary Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037]">
            {passwordLabel}
          </label>
          {isTooShort && (
            <span className="text-[11px] font-semibold text-amber-600">
              Min 6 characters
            </span>
          )}
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            disabled={disabled}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={passwordPlaceholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFBF5] border border-[#D7CCC8] text-sm text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#3E2723] p-1 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#5D4037]">
            {confirmLabel}
          </label>
          {hasTypedBoth && (
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {isMatched ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </span>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            minLength={6}
            disabled={disabled}
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder={confirmPlaceholder}
            className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFBF5] border text-sm text-[#3E2723] placeholder:text-[#BCAAA4] focus:outline-none focus:ring-2 disabled:opacity-50 ${
              isMismatched
                ? 'border-rose-400 focus:ring-rose-400'
                : isMatched
                ? 'border-emerald-400 focus:ring-emerald-400'
                : 'border-[#D7CCC8] focus:ring-[#E07A5F]'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#3E2723] p-1 cursor-pointer"
            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
