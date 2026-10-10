import { LearnerNav } from "@/components/learner-nav";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <LearnerNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
