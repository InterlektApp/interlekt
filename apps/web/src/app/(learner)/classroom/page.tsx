import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ClassroomIndexPage() {
  // Mock — real app: aggregate of all enrolled courses.
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Classroom</h1>
      <p className="mt-1 text-sm text-slate-500">All your courses in one place.</p>
      <div className="mt-6 rounded-xl border bg-white p-8 text-center">
        <p className="font-medium text-slate-900">Course list coming together</p>
        <p className="mt-1 text-sm text-slate-500">
          For now, open a community to see its classroom.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/my-communities">Go to My Communities</Link>
        </Button>
      </div>
    </div>
  );
}
