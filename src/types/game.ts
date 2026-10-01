export interface GameItem {
  id: string;
  title: string;
  category: 'Action' | 'Arcade' | 'Puzzle' | 'Retro' | 'Skill' | 'Sports' | 'Other' | string;
  description: string;
  iframeUrl: string;
  icon?: string;
  accentColor?: string;
  bgGradient?: string;
  rating: number;
  plays: string;
  featured?: boolean;
  controls?: string;
  tags?: string[];
  isCustom?: boolean;
}

export type TabCloakPreset = 'default' | 'docs' | 'classroom' | 'drive' | 'canvas';
