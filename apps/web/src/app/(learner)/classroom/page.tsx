import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClassroomIndexPage() {
  // Mock — real app: aggregate of all enrolled courses.
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <header className="relative overflow-hidden rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-100 via-cyan-50 to-white p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full border-[30px] border-white/60" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="label-eyebrow text-sky-800">Your courses</p>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-slate-950 sm:text-4xl">Classroom</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">All your courses in one place.</p>
        </div>
      </header>
      <section className="mt-6 rounded-2xl border border-dashed border-sky-300 bg-white px-6 py-12 text-center sm:py-14">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-cyan-800"><BookOpen className="h-7 w-7" aria-hidden="true" /></span>
        <p className="mt-4 font-semibold text-slate-950">Course list coming together</p>
        <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-600">For now, open a community to see its classroom.</p>
        <Button className="mt-5" asChild><Link href="/my-communities">Go to My Communities <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></Button>
      </section>
    </main>
  );
}
