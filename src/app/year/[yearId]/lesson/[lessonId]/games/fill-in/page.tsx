import BackLink from "@/components/BackLink";
import FillBlankGame from "@/components/FillBlankGame";
import { supabase } from "@/lib/supabase";
import type { Sentence } from "@/lib/types";

export default async function FillInPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;

  const { data: sentences, error } = await supabase
    .from("sentences")
    .select("*")
    .eq("lesson_id", lessonId);

  if (error) {
    return <main className="p-8">Error loading game: {error.message}</main>;
  }

  const items = (sentences as Sentence[] | null) ?? [];

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto w-full max-w-5xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}/games`}
          label="Back to games"
        />

        <h1 className="mb-3 text-4xl font-bold text-red-700">
          Fill-in-the-blank 填空游戏
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Complete each sentence by placing the missing characters.
        </p>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800">
              暂无句子/无句子
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              No short sentences have been added to this lesson yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((sentence) => (
              <article
                key={sentence.id}
                className="rounded-3xl border-2 border-orange-200 bg-white p-5 shadow-md"
              >
                <h2 className="mb-4 text-xl font-bold text-purple-700">
                  {sentence.english_translation ?? "Complete the sentence"}
                </h2>
                <FillBlankGame
                  sentence={sentence.chinese_text}
                  pinyin={sentence.pinyin ?? undefined}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
