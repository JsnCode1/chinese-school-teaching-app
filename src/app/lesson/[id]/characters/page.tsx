import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function CharactersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: characters, error } = await supabase
    .from("characters")
    .select("*")
    .eq("lesson_id", id);

  if (error) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <p>Error loading characters: {error.message}</p>
        <p>Lesson ID being used: {id}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <Link href={`/lesson/${id}`} className="text-red-600 font-bold">
        ← Back to Lesson
      </Link>

      <h1 className="text-5xl font-bold text-red-700 my-8">Characters 汉字</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {characters?.map((item: CharacterItem) => (
          <Link
            key={item.id}
            href={`/lesson/${id}/characters/${item.id}`}
            className="block bg-white p-8 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition"
          >
            <h2 className="text-6xl font-bold text-red-600">
              {item.character}
            </h2>

            <p className="text-xl text-gray-600 mt-4">{item.pinyin}</p>
            <p className="text-lg text-gray-800 mt-2">{item.meaning}</p>

            <span className="inline-block mt-5 bg-red-600 text-white px-5 py-3 rounded-full font-bold">
              Learn Character →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
