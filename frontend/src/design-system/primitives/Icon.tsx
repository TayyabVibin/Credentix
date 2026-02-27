/**
 * Fintech Icon System
 * Semantic icon mapping using Lucide React for consistent, modern iconography.
 */

import {
  Wallet,
  CreditCard,
  Receipt,
  User,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  LogOut,
  LayoutDashboard,
  DollarSign,
  Webhook,
  Home,
  PlusCircle,
  ShoppingCart,
  Search,
  Eye,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const ICON_NAMES = [
  'wallet',
  'creditCard',
  'receipt',
  'user',
  'settings',
  'checkCircle',
  'xCircle',
  'clock',
  'trendingUp',
  'logOut',
  'dashboard',
  'payment',
  'webhook',
  'home',
  'plusCircle',
  'shoppingCart',
  'search',
  'eye',
] as const;

export type IconName = (typeof ICON_NAMES)[number];

const ICON_MAP: Record<IconName, React.ComponentType<LucideProps>> = {
  wallet: Wallet,
  creditCard: CreditCard,
  receipt: Receipt,
  user: User,
  settings: Settings,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  clock: Clock,
  trendingUp: TrendingUp,
  logOut: LogOut,
  dashboard: LayoutDashboard,
  payment: DollarSign,
  webhook: Webhook,
  home: Home,
  plusCircle: PlusCircle,
  shoppingCart: ShoppingCart,
  search: Search,
  eye: Eye,
};

interface Props extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export default function Icon({ name, size = 20, ...rest }: Props) {
  const Component = ICON_MAP[name];
  if (!Component) return null;
  return <Component size={size} {...rest} />;
}
