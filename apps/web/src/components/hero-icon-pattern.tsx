import {
  Banknote,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Coins,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Hexagon,
  Landmark,
  Lightbulb,
  Lock,
  Medal,
  MessagesSquare,
  Microscope,
  PenTool,
  Puzzle,
  Rocket,
  Search,
  ShieldCheck,
  Sprout,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IconSpot {
  Icon: typeof Rocket;
  top: string;
  left: string;
  size: number;
  rotate: number;
  opacity: number;
}

/**
 * Scattered faded-education-icon field, echoing the Figma hero background.
 * Lucide only, slate tones, aria-hidden. Sits behind content, never
 * intercepts clicks.
 */
const SPOTS: IconSpot[] = [
  { Icon: Trophy, top: "4%", left: "8%", size: 44, rotate: -8, opacity: 0.5 },
  { Icon: Rocket, top: "38%", left: "2%", size: 52, rotate: -12, opacity: 0.45 },
  { Icon: Zap, top: "52%", left: "8%", size: 34, rotate: 0, opacity: 0.5 },
  { Icon: Search, top: "2%", left: "28%", size: 30, rotate: 0, opacity: 0.4 },
  { Icon: MessagesSquare, top: "30%", left: "26%", size: 36, rotate: 8, opacity: 0.4 },
  { Icon: Brain, top: "62%", left: "30%", size: 40, rotate: 0, opacity: 0.4 },
  { Icon: BookOpen, top: "22%", left: "44%", size: 42, rotate: -6, opacity: 0.45 },
  { Icon: Handshake, top: "44%", left: "48%", size: 46, rotate: 0, opacity: 0.4 },
  { Icon: Sprout, top: "58%", left: "44%", size: 38, rotate: 6, opacity: 0.4 },
  { Icon: ShieldCheck, top: "40%", left: "64%", size: 52, rotate: 0, opacity: 0.45 },
  { Icon: Wallet, top: "62%", left: "62%", size: 40, rotate: -8, opacity: 0.4 },
  { Icon: Hexagon, top: "48%", left: "76%", size: 42, rotate: 0, opacity: 0.4 },
  { Icon: Briefcase, top: "64%", left: "82%", size: 46, rotate: 6, opacity: 0.4 },
  { Icon: Landmark, top: "2%", left: "88%", size: 40, rotate: 0, opacity: 0.4 },
  { Icon: Lightbulb, top: "22%", left: "94%", size: 34, rotate: 10, opacity: 0.45 },
  { Icon: Target, top: "40%", left: "92%", size: 36, rotate: 0, opacity: 0.4 },
  { Icon: Video, top: "18%", left: "74%", size: 38, rotate: -6, opacity: 0.35 },
  { Icon: PenTool, top: "30%", left: "82%", size: 34, rotate: 20, opacity: 0.35 },
  { Icon: Star, top: "70%", left: "76%", size: 30, rotate: 0, opacity: 0.4 },
  { Icon: Medal, top: "8%", left: "60%", size: 36, rotate: 8, opacity: 0.35 },
  { Icon: GraduationCap, top: "72%", left: "14%", size: 44, rotate: -6, opacity: 0.35 },
  { Icon: Users, top: "12%", left: "14%", size: 34, rotate: 0, opacity: 0.35 },
  { Icon: Microscope, top: "56%", left: "90%", size: 40, rotate: 0, opacity: 0.35 },
  { Icon: Coins, top: "80%", left: "52%", size: 36, rotate: 0, opacity: 0.35 },
  { Icon: BarChart3, top: "82%", left: "88%", size: 40, rotate: 0, opacity: 0.35 },
  { Icon: Banknote, top: "88%", left: "24%", size: 36, rotate: -8, opacity: 0.3 },
  { Icon: Headphones, top: "84%", left: "70%", size: 34, rotate: 0, opacity: 0.3 },
  { Icon: Heart, top: "50%", left: "56%", size: 32, rotate: 0, opacity: 0.35 },
  { Icon: Lock, top: "90%", left: "40%", size: 34, rotate: 0, opacity: 0.3 },
  { Icon: Puzzle, top: "66%", left: "4%", size: 36, rotate: 10, opacity: 0.3 },
  { Icon: Wifi, top: "76%", left: "94%", size: 30, rotate: 0, opacity: 0.3 },
];

export function HeroIconPattern({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {SPOTS.map(({ Icon, top, left, size, rotate, opacity }, i) => (
        <span
          key={i}
          className="absolute text-slate-400"
          style={{ top, left, opacity: opacity * 0.4, transform: `rotate(${rotate}deg)` }}
        >
          <Icon style={{ width: size, height: size }} strokeWidth={1.5} />
        </span>
      ))}
    </div>
  );
}
