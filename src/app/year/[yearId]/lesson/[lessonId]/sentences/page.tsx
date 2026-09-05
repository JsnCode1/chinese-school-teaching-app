import BackLink from "@/components/BackLink";
import SentencePracticeCard from "@/components/SentencePracticeCard";
import { supabase } from "@/lib/supabase";
import type { Sentence } from "@/lib/types";

export default async function SentencesPage({
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
    return <main className="p-8">Error: {error.message}</main>;
  }

  if (!sentences || sentences.length === 0) {
    return (
      <main className="min-h-screen bg-orange-50 p-6 md:p-10">
        <section className="mx-auto w-full max-w-[95vw]">
          <BackLink
            href={`/year/${yearId}/lesson/${lessonId}`}
            label="Back to lesson"
          />

          <h1 className="mb-8 text-4xl font-bold text-red-700">
            {"Short Sentences 短句 (点击“填空游戏”即可开始游戏)"}
          </h1>

          <div className="flex min-h-[320px] items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-lg">
              <div className="flex items-center justify-center">
                <span className="text-[40px] text-red-700">&#128214;</span>
              </div>
              <h2 className="mt-5 text-3xl font-bold text-gray-800">
                暂无句子/无句子
              </h2>

              <p className="mt-3 text-lg text-gray-600">
                No short sentences have been added to this lesson yet.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto w-full max-w-[95vw]">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <h1 className="mb-6 text-4xl font-bold text-red-700">
          Short Sentences 短句
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {(sentences as Sentence[] | null)?.map((sentence) => (
            <SentencePracticeCard
              key={sentence.id}
              chinese={sentence.chinese_text}
              pinyin={sentence.pinyin}
              english={sentence.english_translation}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
