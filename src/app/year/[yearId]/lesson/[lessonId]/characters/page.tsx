import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;

  const { data: characters, error } = await supabase
    .from("characters")
    .select("*")
    .eq("lesson_id", lessonId);

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <Link
          href={`/year/${yearId}/lesson/${lessonId}`}
          className="font-bold text-red-600"
        >
          ← Back to Lesson
        </Link>

        <p className="mt-6 rounded-xl bg-white p-4 text-red-700 shadow">
          Error loading characters: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <Link
        href={`/year/${yearId}/lesson/${lessonId}`}
        className="font-bold text-red-600"
      >
        ← Back to Lesson
      </Link>

      <h1 className="my-8 text-5xl font-bold text-red-700">Characters 汉字</h1>

      {(!characters || characters.length === 0) && (
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-800">
            No characters found
          </h2>
          <p className="mt-2 text-gray-600">
            Add character rows in Supabase for this lesson.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {characters?.map((item: CharacterItem) => (
          <Link
            key={item.id}
            href={`/year/${yearId}/lesson/${lessonId}/characters/${item.id}`}
            className="block rounded-2xl bg-white p-8 shadow transition hover:scale-105 hover:shadow-xl"
          >
            <h2 className="text-6xl font-bold text-red-600">
              {item.character}
            </h2>

            <p className="mt-4 text-xl text-gray-600">{item.pinyin}</p>

            <p className="mt-2 text-lg text-gray-800">{item.meaning}</p>

            <span className="mt-5 inline-block rounded-full bg-red-600 px-5 py-3 font-bold text-white">
              Learn Character →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
