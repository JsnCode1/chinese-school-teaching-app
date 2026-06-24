import BackLink from "@/components/BackLink";
import InteractiveStoryText from "@/components/InteractiveStoryText";
import { supabase } from "@/lib/supabase";
import type { Story } from "@/lib/types";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;
  const { data: lesson } = await supabase
    .from("lessons")
    .select("title")
    .eq("id", lessonId)
    .single();

  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .eq("lesson_id", lessonId);

  if (error) {
    return <main className="p-8">Error loading story: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-5xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <h1 className="text-5xl font-bold text-red-700">
            课文 《{lesson?.title}》
          </h1>

          {stories?.[0]?.page_number && (
            <span className="rounded-full bg-blue-100 px-5 py-2 text-xl font-bold text-blue-700 shadow">
              第 {stories[0].page_number} 页
            </span>
          )}
        </div>

        <div className="space-y-8">
          {(stories as Story[] | null)?.map((story) => (
            <div key={story.id} className="rounded-3xl bg-white p-8 shadow-lg">
              <InteractiveStoryText
                chineseText={story.chinese_text}
                pinyin={story.pinyin}
              />

              <div className="mt-10 rounded-2xl bg-green-50 p-4">
                <h2 className="mb-2 text-lg font-bold text-green-700">
                  English Translation
                </h2>

                <p className="text-lg text-gray-700">
                  {story.english_translation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
