'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LucideIcon } from 'lucide-react';
import { soundEngine } from '@/lib/audio/sound-engine';

interface NavLinkItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface TopNavMobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLinkItem[];
}

export const TopNavMobileDrawer: React.FC<TopNavMobileDrawerProps> = ({
  isOpen,
  onClose,
  navLinks,
}) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-3 pt-3 border-t border-[#EFEBE9] flex flex-col gap-2 pb-2">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
              isActive ? 'bg-[#FBE9E7] text-[#E07A5F]' : 'text-[#5D4037] hover:bg-[#F5EFEB]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};
