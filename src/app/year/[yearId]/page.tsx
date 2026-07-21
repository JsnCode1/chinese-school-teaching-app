import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Lesson, Year } from "@/lib/types";
import LessonCard from "@/components/LessonCard";

export default async function YearPage({
  params,
}: {
  params: Promise<{ yearId: string }>;
}) {
  const { yearId } = await params;

  // Fetch the year information
  const { data: year } = await supabase
    .from("years")
    .select("*")
    .eq("id", yearId)
    .single();

  // Fetch lessons for this year
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("year_id", yearId)
    .order("lesson_number", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <Link href="/" className="font-bold text-red-600">
          ← Back to Years
        </Link>

        <p className="mt-6 rounded-xl bg-white p-4 text-red-700 shadow">
          Error loading lessons: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <Link href="/" className="font-bold text-red-600">
        ← Back to Years
      </Link>

      <h1 className="mt-8 text-5xl font-bold text-red-700">
        Year {year?.year_number} Lessons
      </h1>

      <p className="mt-3 mb-10 text-lg text-gray-700">
        Choose a lesson to begin.
      </p>

      {(!lessons || lessons.length === 0) && (
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-800">No lessons found</h2>

          <p className="mt-2 text-gray-600">
            This year group does not have any lessons yet.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {lessons?.map((lesson: Lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} yearId={yearId} />
        ))}
      </div>
    </main>
  );
}
