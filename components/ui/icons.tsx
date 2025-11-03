import React from 'react';
import type { ComponentType } from 'react';
import * as PhosphorIcons from 'phosphor-react-native';
import type { IconProps } from 'phosphor-react-native';

export const IconSizes = { xs:16, sm:20, md:24, lg:28, xl:32 } as const;
export type IconSizeKey = keyof typeof IconSizes | number;
export type IconWeight = IconProps['weight'];

export const DEFAULT_ICON_COLOR = '#111827'; // slate-900
export const DEFAULT_ICON_SIZE: IconSizeKey = 'md';
export const DEFAULT_ICON_WEIGHT: IconWeight = 'regular';

export type IconName =
  | 'syringe' | 'calendar' | 'gear' | 'chartLine'
  | 'flame' | 'forkKnife' | 'notePencil' | 'scales'
  | 'bell' | 'clock' | 'trendUp' | 'lock' | 'export' | 'trash' | 'deviceMobile' | 'chat' | 'fileText' | 'clipboardText' | 'signOut' | 'warning'
  | 'arrowDown' | 'arrowUp' | 'minus'
  | 'smiley' | 'fist' | 'checkCircle' | 'faceNeutral' | 'faceSad' | 'faceAngry' | 'stomach' | 'moonStars'
  | 'waves' | 'arrowRight'
  | 'heart' | 'sparkle' | 'stethoscope' | 'target' | 'trendDown' | 'pencil'
  | 'share' | 'table';

function getIcon<T extends keyof typeof PhosphorIcons>(
  name: T,
  fallback?: keyof typeof PhosphorIcons
): ComponentType<IconProps> {
  const icon = PhosphorIcons[name] as unknown as ComponentType<IconProps> | undefined;
  if (icon) return icon;
  if (fallback) {
    const fallbackIcon = PhosphorIcons[fallback] as unknown as ComponentType<IconProps> | undefined;
    if (fallbackIcon) return fallbackIcon;
  }
  throw new Error(`Icon "${String(name)}" not found in phosphor-react-native`);
}

const ICONS: Record<IconName, ComponentType<IconProps>> = {
  syringe: getIcon('Syringe'),
  calendar: getIcon('Calendar'),
  gear: getIcon('Gear'),
  chartLine: getIcon('ChartLine'),
  flame: getIcon('Flame'),
  forkKnife: getIcon('ForkKnife'),
  notePencil: getIcon('NotePencil'),
  scales: getIcon('Scales'),
  bell: getIcon('Bell'),
  clock: getIcon('Clock'),
  trendUp: getIcon('TrendUp'),
  lock: getIcon('Lock'),
  export: getIcon('Export'),
  trash: getIcon('Trash'),
  deviceMobile: getIcon('DeviceMobile'),
  chat: getIcon('Chat'),
  fileText: getIcon('FileText'),
  clipboardText: getIcon('ClipboardText'),
  signOut: getIcon('SignOut'),
  warning: getIcon('Warning'),
  arrowDown: getIcon('ArrowDown'),
  arrowUp: getIcon('ArrowUp'),
  minus: getIcon('Minus'),
  smiley: getIcon('Smiley'),
  fist: getIcon('HandFist'),
  checkCircle: getIcon('CheckCircle'),
  faceNeutral: getIcon('SmileyMeh'),
  faceSad: getIcon('SmileySad'),
  faceAngry: getIcon('SmileyXEyes'),
  stomach: getIcon('Heartbeat'),
  moonStars: getIcon('MoonStars'),
  waves: getIcon('WaveSine'), // WaveSine exists in phosphor-react-native
  arrowRight: getIcon('ArrowRight'),
  heart: getIcon('Heart'),
  sparkle: getIcon('Sparkle'),
  stethoscope: getIcon('FirstAidKit'),
  target: getIcon('Crosshair'), // Crosshair exists in phosphor-react-native (target-like)
  trendDown: getIcon('TrendDown'),
  pencil: getIcon('Pencil'),
  share: getIcon('ShareNetwork'),
  table: getIcon('Table'),
};

function resolveSize(size: IconSizeKey): number {
  if (typeof size === 'number') return size;
  return IconSizes[size] ?? IconSizes.md;
}

export type AppIconProps = {
  name: IconName;
  size?: IconSizeKey;
  color?: string;
  weight?: IconWeight;
} & Omit<IconProps, 'size' | 'color' | 'weight'>;

export function AppIcon({
  name, size = DEFAULT_ICON_SIZE, color = DEFAULT_ICON_COLOR,
  weight = DEFAULT_ICON_WEIGHT, ...rest
}: AppIconProps) {
  const Comp = ICONS[name];
  return <Comp size={resolveSize(size)} color={color} weight={weight} {...rest} />;
}

// TabBar: outline (inativo) / fill (ativo)
export function makeTabBarIcon(name: IconName) {
  return function TabBarIcon({
    focused, size, color
  }: { focused: boolean; size?: number; color?: string }) {
    return (
      <AppIcon
        name={name}
        size={size ?? IconSizes.md}
        color={color ?? DEFAULT_ICON_COLOR}
        weight={focused ? 'fill' : 'regular'}
      />
    );
  };
}

// Wrappers (uso em telas/listas)
export const InjectionsIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="syringe" {...p} />;
export const ResultsIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="chartLine" {...p} />;
export const CalendarIcon  = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="calendar" {...p} />;
export const SettingsIcon  = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="gear" {...p} />;
export const CaloriesIcon  = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="flame" {...p} />;
export const ProteinIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="forkKnife" {...p} />;
export const NotesIcon     = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="notePencil" {...p} />;
export const WeightIcon    = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="scales" {...p} />;
export const BellIcon      = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="bell" {...p} />;
export const ClockIcon     = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="clock" {...p} />;
export const TrendUpIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="trendUp" {...p} />;
export const LockIcon      = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="lock" {...p} />;
export const ExportIcon    = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="export" {...p} />;
export const TrashIcon     = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="trash" {...p} />;
export const DeviceMobileIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="deviceMobile" {...p} />;
export const ChatIcon      = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="chat" {...p} />;
export const FileTextIcon  = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="fileText" {...p} />;
export const ClipboardTextIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="clipboardText" {...p} />;
export const SignOutIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="signOut" {...p} />;
export const WarningIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="warning" {...p} />;
export const ArrowDownIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="arrowDown" {...p} />;
export const ArrowUpIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="arrowUp" {...p} />;
export const MinusIcon     = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="minus" {...p} />;
export const SmileyIcon    = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="smiley" {...p} />;
export const FistIcon      = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="fist" {...p} />;
export const CheckCircleIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="checkCircle" {...p} />;
export const FaceNeutralIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="faceNeutral" {...p} />;
export const FaceSadIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="faceSad" {...p} />;
export const FaceAngryIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="faceAngry" {...p} />;
export const StomachIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="stomach" {...p} />;
export const MoonStarsIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="moonStars" {...p} />;
export const WavesIcon     = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="waves" {...p} />;
export const ArrowRightIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="arrowRight" {...p} />;
export const HeartIcon     = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="heart" {...p} />;
export const SparkleIcon   = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="sparkle" {...p} />;
export const StethoscopeIcon = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="stethoscope" {...p} />;
export const TargetIcon      = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="target" {...p} />;
export const ShareIcon       = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="share" {...p} />;
export const TableIcon       = (p: Omit<AppIconProps, 'name'>) => <AppIcon name="table" {...p} />;
