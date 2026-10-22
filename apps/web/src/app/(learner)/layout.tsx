import { LearnerShell } from "@/components/learner/learner-shell";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return <LearnerShell>{children}</LearnerShell>;
}
