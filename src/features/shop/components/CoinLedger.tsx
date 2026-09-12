'use client';

import React, { useState } from 'react';
import {
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Gift,
  Shield,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ActivityLog, Profile } from '@/types/database';

interface CoinLedgerProps {
  profile: Profile;
  activityLogs: ActivityLog[];
}

type LedgerFilter = 'all' | 'earned' | 'spent';

export const CoinLedger: React.FC<CoinLedgerProps> = ({
  profile,
  activityLogs,
}) => {
  const [filter, setFilter] = useState<LedgerFilter>('all');

  const coinTransactions = activityLogs.filter(
    (log) => log.coins_change !== undefined && log.coins_change !== 0
  );

  const totalEarned = coinTransactions
    .filter((log) => (log.coins_change || 0) > 0)
    .reduce((sum, log) => sum + (log.coins_change || 0), 0);

  const totalSpent = Math.abs(
    coinTransactions
      .filter((log) => (log.coins_change || 0) < 0)
      .reduce((sum, log) => sum + (log.coins_change || 0), 0)
  );

  const filteredTransactions = coinTransactions.filter((log) => {
    if (filter === 'earned') return (log.coins_change || 0) > 0;
    if (filter === 'spent') return (log.coins_change || 0) < 0;
    return true;
  });

  const getTransactionDetails = (log: ActivityLog) => {
    switch (log.action_type) {
      case 'pomo_finished':
        return {
          title: 'Deep Focus Pomodoro Session',
          subtitle: `${log.metadata?.duration_minutes || 25} min focused study completed`,
          icon: Clock,
          iconBg: 'bg-sky-100 text-sky-700',
        };
      case 'quest_completed':
        return {
          title: 'Quest Completed',
          subtitle: (log.metadata?.quest_title as string) || 'Daily quest fulfilled',
          icon: CheckCircle2,
          iconBg: 'bg-emerald-100 text-emerald-700',
        };
      case 'item_purchased':
        return {
          title: 'Boutique Apparel / Companion',
          subtitle: (log.metadata?.item_name as string) || 'Virtual boutique item',
          icon: ShoppingBag,
          iconBg: 'bg-purple-100 text-purple-700',
        };
      case 'voucher_redeemed':
        return {
          title: 'Real-Life Reward Voucher',
          subtitle: (log.metadata?.voucher_title as string) || 'Guilt-free treat unlocked',
          icon: Gift,
          iconBg: 'bg-orange-100 text-orange-700',
        };
      case 'streak_shield_bought':
        return {
          title: 'Streak Freeze Shield Insurance',
          subtitle: 'Guards against 1 missed study day',
          icon: Shield,
          iconBg: 'bg-blue-100 text-blue-700',
        };
      case 'gacha_pulled': {
        const itemName = log.metadata?.item_name;
        return {
          title: 'Mystery Capsule Machine Turn',
          subtitle: itemName ? `Drawn: ${itemName}` : 'Turned the gacha dial',
          icon: Sparkles,
          iconBg: 'bg-pink-100 text-pink-700',
        };
      }
      default:
        return {
          title: 'Study Coin Activity',
          subtitle: 'Komorebi reward economy balance adjustment',
          icon: Coins,
          iconBg: 'bg-amber-100 text-amber-700',
        };
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#EFEBE9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8D6E63] font-semibold mb-1">
            <span>Current Balance</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#3E2723]">
            {profile.coins} <span className="text-sm font-bold text-amber-600">🪙</span>
          </div>
          <div className="text-[10px] text-[#8D6E63] mt-0.5">Available for shop & vouchers</div>
        </div>

        <div className="bg-white border border-[#EFEBE9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8D6E63] font-semibold mb-1">
            <span>Total Earned</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">
            +{totalEarned} <span className="text-sm font-bold text-emerald-600">🪙</span>
          </div>
          <div className="text-[10px] text-[#8D6E63] mt-0.5">From focus & completed quests</div>
        </div>

        <div className="bg-white border border-[#EFEBE9] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#8D6E63] font-semibold mb-1">
            <span>Total Invested</span>
            <ArrowDownLeft className="w-4 h-4 text-[#E07A5F]" />
          </div>
          <div className="text-2xl font-extrabold text-[#E07A5F]">
            -{totalSpent} <span className="text-sm font-bold text-[#E07A5F]">🪙</span>
          </div>
          <div className="text-[10px] text-[#8D6E63] mt-0.5">Spent on rewards, shields & gacha</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-[#EFEBE9] pb-3">
        <div className="flex items-center gap-1.5">
          {(['all', 'earned', 'spent'] as LedgerFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#3E2723] text-white shadow-xs'
                  : 'bg-white border border-[#EFEBE9] text-[#5D4037] hover:bg-[#F5EFEB]'
              }`}
            >
              {tab === 'all' ? 'All Transactions' : tab === 'earned' ? 'Earned (+)' : 'Spent (-)'}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#8D6E63] font-semibold">
          {filteredTransactions.length} Record{filteredTransactions.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-[#EFEBE9] p-6">
            <Coins className="w-8 h-8 text-[#D7CCC8] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#3E2723]">No Coin Records Found</p>
            <p className="text-[11px] text-[#8D6E63] mt-1">
              Complete quests or focus sessions to build your study economy!
            </p>
          </div>
        ) : (
          filteredTransactions.map((log, index) => {
            const details = getTransactionDetails(log);
            const Icon = details.icon;
            const isPositive = (log.coins_change || 0) > 0;

            return (
              <div
                key={`${log.id || 'tx'}-${index}`}
                className="bg-white border border-[#EFEBE9] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-xs hover:border-[#D7CCC8] transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${details.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#3E2723] truncate">
                      {details.title}
                    </h4>
                    <p className="text-[11px] text-[#8D6E63] truncate">{details.subtitle}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-sm sm:text-base font-extrabold flex items-center justify-end gap-1 ${
                      isPositive ? 'text-emerald-700' : 'text-[#E07A5F]'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                    <span>
                      {isPositive ? `+${log.coins_change}` : log.coins_change} 🪙
                    </span>
                  </div>
                  <span className="text-[10px] text-[#A1887F] block mt-0.5">
                    {formatDate(log.created_at)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
