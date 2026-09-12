export type GachaRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'jackpot';

export interface GachaItem {
  id: string;
  name: string;
  rarity: GachaRarity;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
  bonusCoins?: number;
}

export const GACHA_PULL_COST = 30;

export const GACHA_POOL: GachaItem[] = [
  {
    id: 'mini_bonsai',
    name: 'Miniature Zen Bonsai',
    rarity: 'common',
    description: 'A miniature potted Japanese pine that radiates tranquil calm across your desk.',
    icon: 'Trees',
    color: '#4CAF50',
    glowColor: 'rgba(76, 175, 80, 0.4)',
  },
  {
    id: 'brass_pencil',
    name: 'Brass Drafting Pencil',
    rarity: 'common',
    description: 'A solid brass mechanical drafting pencil crafted for precision problem-solving.',
    icon: 'PenTool',
    color: '#D4AF37',
    glowColor: 'rgba(212, 175, 55, 0.4)',
  },
  {
    id: 'matcha_whisk',
    name: 'Ceramic Matcha Whisk',
    rarity: 'uncommon',
    description: 'Traditional bamboo chasen and handmade speckled green ceramic tea cup.',
    icon: 'Coffee',
    color: '#81C784',
    glowColor: 'rgba(129, 199, 132, 0.5)',
  },
  {
    id: 'sakura_crane',
    name: 'Sakura Origami Crane',
    rarity: 'uncommon',
    description: 'Folded from textured washi paper, believed to grant good fortune during exams.',
    icon: 'Sparkles',
    color: '#F48FB1',
    glowColor: 'rgba(244, 143, 177, 0.5)',
  },
  {
    id: 'lofi_cassette',
    name: 'Retro Lo-Fi Tape Vol. 1',
    rarity: 'rare',
    description: 'Vintage audio cassette loaded with magnetic, warm procedural lo-fi study grooves.',
    icon: 'Disc',
    color: '#BA68C8',
    glowColor: 'rgba(186, 104, 200, 0.6)',
  },
  {
    id: 'crystal_orb',
    name: 'Moonlight Glass Prism',
    rarity: 'rare',
    description: 'Faceted optical glass that refracts morning sunlight into vivid rainbow patterns.',
    icon: 'Gem',
    color: '#64B5F6',
    glowColor: 'rgba(100, 181, 246, 0.6)',
  },
  {
    id: 'golden_trophy',
    name: 'Golden Scholar Owl',
    rarity: 'legendary',
    description: 'A majestic golden owl statuette awarded only to the most persistent scholars.',
    icon: 'Trophy',
    color: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.8)',
  },
  {
    id: 'lucky_coins',
    name: 'Jackpot Coin Pouch',
    rarity: 'jackpot',
    description: 'A silk drawstring bag overflowing with +60 bonus study coins!',
    icon: 'Coins',
    color: '#FF9800',
    glowColor: 'rgba(255, 152, 0, 0.8)',
    bonusCoins: 60,
  },
];

export const RARITY_CONFIG: Record<
  GachaRarity,
  { label: string; badgeColor: string; dropRate: string }
> = {
  common: {
    label: 'Common',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dropRate: '40%',
  },
  uncommon: {
    label: 'Uncommon',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    dropRate: '30%',
  },
  rare: {
    label: 'Rare',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    dropRate: '18%',
  },
  legendary: {
    label: 'Legendary',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    dropRate: '7%',
  },
  jackpot: {
    label: 'Jackpot',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
    dropRate: '5%',
  },
};

/**
 * Weighted random draw from the gacha pool
 */
export function drawGachaItem(): GachaItem {
  const rand = Math.random() * 100;
  if (rand < 5) {
    return GACHA_POOL.find((i) => i.rarity === 'jackpot') || GACHA_POOL[0];
  } else if (rand < 12) {
    return GACHA_POOL.find((i) => i.rarity === 'legendary') || GACHA_POOL[0];
  } else if (rand < 30) {
    const rares = GACHA_POOL.filter((i) => i.rarity === 'rare');
    return rares[Math.floor(Math.random() * rares.length)];
  } else if (rand < 60) {
    const uncommons = GACHA_POOL.filter((i) => i.rarity === 'uncommon');
    return uncommons[Math.floor(Math.random() * uncommons.length)];
  } else {
    const commons = GACHA_POOL.filter((i) => i.rarity === 'common');
    return commons[Math.floor(Math.random() * commons.length)];
  }
}
