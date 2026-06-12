import BackLink from "@/components/BackLink";
import ContentCard from "@/components/ContentCard";
import { supabase } from "@/lib/supabase";
import type { Story } from "@/lib/types";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .eq("lesson_id", id);

  if (error) return <main className="p-8">Error: {error.message}</main>;

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-5xl">
        <BackLink href={`/lesson/${id}`} label="Back to lesson" />
        <h1 className="mb-6 text-4xl font-bold text-red-700">Story 故事</h1>
        <div className="grid gap-6">
          {(stories as Story[] | null)?.map((story) => (
            <ContentCard
              key={story.id}
              chinese={story.chinese_text}
              pinyin={story.pinyin}
              english={story.english_translation}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
