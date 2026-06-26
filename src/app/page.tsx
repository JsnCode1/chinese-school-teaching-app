import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Year } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: years, error } = await supabase
    .from("years")
    .select("*")
    .order("year_number", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <h1 className="text-4xl font-bold text-red-700">
          Chinese School 中文学校
        </h1>
        <p className="mt-4 rounded-2xl bg-white p-4 text-red-700 shadow">
          Error loading years: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6 md:p-10">
      <section className="mx-auto mb-10 max-w-6xl rounded-[2rem] bg-white p-8 shadow-lg">
        <p className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
          Chinese School App
        </p>

        <h1 className="text-5xl font-extrabold text-gray-900 md:text-7xl">
          Chinese School 中文学校
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Choose your year group to start learning.
        </p>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Year Groups</h2>
            <p className="text-gray-600">Click a year to see its lessons.</p>
          </div>

          <p className="rounded-full bg-white px-4 py-2 font-bold text-red-700 shadow">
            {years?.length ?? 0} available
          </p>
        </div>

        {(!years || years.length === 0) && (
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">No years found</h2>
            <p className="mt-2 text-gray-600">
              Add rows to the Supabase years table.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(years as Year[] | null)?.map((year) => (
            <Link
              key={year.id}
              href={`/year/${year.id}`}
              className="block rounded-3xl border-2 border-orange-200 bg-white p-8 shadow transition hover:scale-105 hover:border-red-400 hover:shadow-xl"
            >
              <p className="mb-4 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
                Year Group
              </p>

              <h2 className="text-5xl font-extrabold text-red-600">
                Year {year.year_number}
              </h2>

              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                {year.title}
              </h3>

              <p className="mt-3 text-gray-600">{year.description}</p>

              <span className="mt-6 inline-block rounded-full bg-red-600 px-5 py-3 font-bold text-white">
                Open Year →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
