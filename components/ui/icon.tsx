import {
  ShieldCheck,
  FileCheck2,
  ClipboardCheck,
  HardHat,
  Users,
  TrendingUp,
  Home,
  Handshake,
  MapPinCheck,
  Building2,
  KeyRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  ShieldCheck,
  FileCheck2,
  ClipboardCheck,
  HardHat,
  Users,
  TrendingUp,
  Home,
  Handshake,
  MapPinCheck,
  Building2,
  KeyRound,
  Wallet,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? ShieldCheck;
  return <Cmp className={className} aria-hidden="true" />;
}
