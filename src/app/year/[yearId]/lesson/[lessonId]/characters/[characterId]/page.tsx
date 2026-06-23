import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{
    yearId: string;
    lessonId: string;
    characterId: string;
  }>;
}) {
  const { yearId, lessonId, characterId } = await params;

  const { data: character, error } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .single();

  if (error || !character) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <Link href={`/year/${yearId}/lesson/${lessonId}/characters`}>
          ← Back to Characters
        </Link>

        <p className="mt-6">Character not found.</p>
      </main>
    );
  }

  const item = character as CharacterItem;

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <Link
        href={`/year/${yearId}/lesson/${lessonId}/characters`}
        className="font-bold text-red-600"
      >
        ← Back to Characters
      </Link>

      <section className="mt-8 rounded-3xl bg-white p-8 shadow">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-red-600">{item.character}</h1>

          <p className="mt-4 text-3xl italic text-gray-600">{item.pinyin}</p>

          <p className="mt-2 text-2xl text-gray-800">{item.meaning}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoBox title="笔画数" value={item.stroke_count ?? "Unknown"} />
          <InfoBox title="偏旁部首" value={item.radical ?? "Unknown"} />
          <InfoBox title="英文" value={item.meaning ?? "Unknown"} />
          <InfoBox title="例子" value={item.example ?? "No example yet"} />
        </div>

        <div className="mt-8 rounded-2xl bg-orange-50 p-6">
          <h2 className="mb-3 text-2xl font-bold">笔画</h2>
          <p className="text-gray-700">
            {item.stroke_order_note ?? "Stroke order can be added later."}
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-red-50 p-6">
          <h2 className="mb-3 text-2xl font-bold">
            Words and phrases using {item.character}
          </h2>

          {item.common_words && item.common_words.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {item.common_words.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-white px-5 py-3 text-xl font-bold text-red-600 shadow"
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p>No words added yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function InfoBox({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6">
      <h3 className="font-bold text-gray-500">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
