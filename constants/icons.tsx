import {
  House,
  Syringe,
  ChartLineUp,
  Calendar,
  GearSix,
  Plus,
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  DotsThreeVertical,
  TrendDown,
  TrendUp,
  Target,
  Scales,
  Percent,
  User,
  ArrowsClockwise,
  CalendarCheck,
  List,
  Pill,
  Clock,
  MapPin,
  Note,
  Warning,
  CheckCircle,
  XCircle,
  Info,
  Bell,
  Palette,
  Database,
  SignOut,
  PaintBrush,
  CloudArrowDown,
  ChartBar,
  Person,
  FlagCheckered,
  CalendarBlank,
  FirstAid,
  FileX,
  Trash,
  PencilSimple,
  FunnelSimple,
  SortAscending,
  Eye,
  EyeSlash,
} from 'phosphor-react-native';

export const Icons = {
  // Navigation (Bottom Tabs)
  home: House,
  shots: Syringe,
  results: ChartLineUp,
  calendar: Calendar,
  settings: GearSix,

  // Actions
  add: Plus,
  back: CaretLeft,
  next: CaretRight,
  search: MagnifyingGlass,
  menu: DotsThreeVertical,
  refresh: ArrowsClockwise,
  delete: Trash,
  edit: PencilSimple,
  filter: FunnelSimple,
  sort: SortAscending,

  // Metrics & Results
  weightDown: TrendDown,
  weightUp: TrendUp,
  target: Target,
  scale: Scales,
  percent: Percent,
  user: User,
  bmi: Person,
  goal: FlagCheckered,
  chart: ChartBar,

  // Injection related
  medication: Pill,
  time: Clock,
  location: MapPin,
  notes: Note,

  // Status indicators
  success: CheckCircle,
  error: XCircle,
  warning: Warning,
  info: Info,

  // Settings
  notification: Bell,
  theme: Palette,
  data: Database,
  logout: SignOut,
  customize: PaintBrush,
  export: CloudArrowDown,

  // Calendar
  calendarBlank: CalendarBlank,
  calendarCheck: CalendarCheck,

  // Others
  list: List,
  firstAid: FirstAid,
  empty: FileX,
  eye: Eye,
  eyeSlash: EyeSlash,
};

export type IconName = keyof typeof Icons;
