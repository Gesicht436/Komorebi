'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/lib/audio/sound-engine';

interface CreateVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, cost: number, icon: string) => Promise<void>;
}

export const CreateVoucherModal: React.FC<CreateVoucherModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [cost, setCost] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    soundEngine.playClick();
    try {
      await onCreate(title.trim(), Number(cost), 'gift');
      setTitle('');
      setCost(50);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/30 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#FFFBF5] border border-[#EFEBE9] rounded-3xl p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="text-lg font-bold text-[#3E2723] mb-3">
              Create Custom Reward Voucher
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#5D4037] mb-1">
                  Reward Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 1 Episode of Anime, Matcha Latte, Spa Day"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D7CCC8] text-xs focus:ring-1 focus:ring-[#E07A5F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#5D4037] mb-1">
                  Cost in Coins
                </label>
                <input
                  type="number"
                  min="5"
                  max="1000"
                  required
                  value={cost}
                  onChange={(e) => setCost(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D7CCC8] text-xs focus:ring-1 focus:ring-[#E07A5F]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#8D6E63] hover:bg-[#F5EFEB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-xs hover:bg-[#D46A4F] cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Voucher'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
