import React from 'react';
import { Icons, IconName } from '@/constants/icons';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  weight = 'regular'
}) => {
  const colors = useShotsyColors();
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color || colors.text}
      weight={weight}
    />
  );
};
