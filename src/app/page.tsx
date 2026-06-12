import LessonCard from "@/components/LessonCard";
import { supabase } from "@/lib/supabase";
import type { Lesson } from "@/lib/types";

export default async function HomePage() {
  // Fetch all lessons from Supabase and sort them by lesson number.
  const { data: lessons, error } = await supabase
    .from("lessons")
    .select("*")
    .order("lesson_number", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <h1 className="text-4xl font-bold text-red-700">Chinese Lessons</h1>
        <p className="mt-4 rounded-2xl bg-white p-4 text-red-700 shadow">
          Error: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6 md:p-10">
      <section className="mx-auto mb-10 max-w-6xl rounded-[2rem] bg-white p-8 shadow-lg md:flex md:items-center md:justify-between">
        <div>
          <p className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
            Chinese School App
          </p>
          <h1 className="text-5xl font-extrabold text-gray-900 md:text-7xl">
            中文课三年级
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Choose a lesson and practise stories, characters, phrases, and short
            sentences.
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-yellow-100 p-6 text-center md:mt-0">
          <div className="text-7xl font-bold text-red-600">学</div>
          <p className="mt-2 font-bold text-gray-700">Let&apos;s learn!</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Lessons</h2>
            <p className="text-gray-600">Click a card to open that lesson.</p>
          </div>
          <p className="rounded-full bg-white px-4 py-2 font-bold text-red-700 shadow">
            {lessons?.length ?? 0} available
          </p>
        </div>

        {(!lessons || lessons.length === 0) && (
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold">No lessons found</h2>
            <p className="mt-2 text-gray-600">
              Run the SQL seed file in Supabase to add lessons.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(lessons as Lesson[] | null)?.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>
    </main>
  );
}
