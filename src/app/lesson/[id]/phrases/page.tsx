import BackLink from "@/components/BackLink";
import ContentCard from "@/components/ContentCard";
import { supabase } from "@/lib/supabase";
import type { Phrase } from "@/lib/types";

export default async function PhrasesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: phrases, error } = await supabase
    .from("phrases")
    .select("*")
    .eq("lesson_id", id);

  if (error) return <main className="p-8">Error: {error.message}</main>;

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <BackLink href={`/lesson/${id}`} label="Back to lesson" />
        <h1 className="mb-6 text-4xl font-bold text-red-700">Phrases 词组</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {(phrases as Phrase[] | null)?.map((phrase) => (
            <ContentCard
              key={phrase.id}
              chinese={phrase.chinese_text}
              pinyin={phrase.pinyin}
              english={phrase.english_translation}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
