import { MOCK_CATEGORIES } from "@/lib/mocks";

export default function ProfilePage() {
  // Mock — real app: GET /users/me + PATCH for edits.
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
      <div className="mt-6 rounded-xl border bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-2xl font-bold text-white">
            Y
          </div>
          <div>
            <p className="font-semibold text-slate-900">Your Name</p>
            <p className="text-sm text-slate-500">you@example.com · Learner</p>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-700">Learning interests</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {MOCK_CATEGORIES.slice(0, 3).map((c) => (
              <span
                key={c.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {c.name}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          Profile editing (avatar, bio, interests) wires up to PATCH /users/me once the
          backend is live.
        </p>
      </div>
    </div>
  );
}
