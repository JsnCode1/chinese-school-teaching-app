import BackLink from "@/components/BackLink";
import ContentCard from "@/components/ContentCard";
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

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <h1 className="mb-6 text-4xl font-bold text-red-700">
          Short Sentences 短句
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {(sentences as Sentence[] | null)?.map((sentence) => (
            <ContentCard
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
