import React from 'react';
import {
  Gamepad2,
  Grid3x3,
  Layers,
  Zap,
  Rocket,
  Compass,
  Shield,
  Footprints,
  Activity,
  Flag,
  Move,
  Sparkles,
} from 'lucide-react';

interface GameIconProps {
  name?: string;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ name, className = 'w-6 h-6' }) => {
  switch (name?.toLowerCase()) {
    case 'grid3x3':
      return <Grid3x3 className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'footprints':
      return <Footprints className={className} />;
    case 'activity':
      return <Activity className={className} />;
    case 'flag':
      return <Flag className={className} />;
    case 'move':
      return <Move className={className} />;
    default:
      return <Gamepad2 className={className} />;
  }
};
