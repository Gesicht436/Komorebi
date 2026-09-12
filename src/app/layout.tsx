import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Komorebi: Life RPG | Cozy Lo-Fi Habit & Quest Progression',
  description: 'Transform mundane daily tasks into a warm, tactile anime study RPG progression with customizable companions, lo-fi soundscapes, and non-linear leveling.',
  keywords: ['Life RPG', 'Gamified Productivity', 'Lo-Fi Study', 'Habit Tracker', 'Pomodoro RPG', 'Anime Study Room'],
  authors: [{ name: 'Komorebi Team' }],
  openGraph: {
    title: 'Komorebi: Life RPG',
    description: 'Transform mundane daily tasks into a warm, tactile anime study RPG progression.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#FFFBF5] text-[#3E2723] antialiased selection:bg-[#FBE9E7] selection:text-[#E07A5F]"
      >
        {children}
      </body>
    </html>
  );
}
