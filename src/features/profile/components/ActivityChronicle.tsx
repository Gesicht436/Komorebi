'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { ActivityLog } from '@/types/database';

interface ActivityChronicleProps {
  activityLogs: ActivityLog[];
}

export const ActivityChronicle: React.FC<ActivityChronicleProps> = ({ activityLogs }) => {
  return (
    <div className="bg-white border border-[#EFEBE9] rounded-3xl p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-[#8D6E63]" />
        <h2 className="text-xl font-extrabold text-[#3E2723]">Progression Chronicle</h2>
      </div>

      {activityLogs.length > 0 ? (
        <div className="divide-y divide-[#EFEBE9] max-h-80 overflow-y-auto pr-2">
          {activityLogs.map((log, index) => (
            <div key={`${log.id || 'log'}-${index}`} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#3E2723] capitalize">
                  {log.action_type.replace('_', ' ')}
                </span>
                {log.attribute && (
                  <span className="ml-2 text-[10px] text-[#8D6E63] capitalize">
                    ({log.attribute})
                  </span>
                )}
                <div className="text-[10px] text-[#BCAAA4]" suppressHydrationWarning>
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-2 font-bold">
                {log.xp_gained > 0 && (
                  <span className="text-[#E07A5F]">+{log.xp_gained} XP</span>
                )}
                {log.coins_change !== 0 && (
                  <span className={log.coins_change > 0 ? 'text-[#F57F17]' : 'text-red-500'}>
                    {log.coins_change > 0 ? `+${log.coins_change}` : log.coins_change} 🪙
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-[#8D6E63] italic">
          No activity logs recorded yet. Begin your journey on the Quest Board!
        </p>
      )}
    </div>
  );
};
