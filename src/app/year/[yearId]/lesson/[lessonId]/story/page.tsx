import BackLink from "@/components/BackLink";
import InteractiveStoryText from "@/components/InteractiveStoryText";
import InteractivePoemText from "@/components/InteractivePoemText";
import { supabase } from "@/lib/supabase";
import type { Story } from "@/lib/types";

export const dynamic = "force-dynamic";

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
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error) {
    return <main className="p-8">Error loading story: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
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

        <div
          className={
            stories && stories.length > 1
              ? "grid gap-8 lg:grid-cols-2"
              : "space-y-8"
          }
        >
          {(stories as Story[] | null)?.map((story) => (
            <div
              key={story.id}
              className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg"
            >
              {story.image_path && (
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url(${story.image_path})`,
                    backgroundSize: "contain",
                    backgroundPosition: "right center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
              )}

              <div className="relative z-10">
                {(story.title || story.author) && (
                  <div className="mb-8 text-center">
                    {story.title && (
                      <h2 className="text-4xl font-extrabold text-red-700">
                        {story.title}
                      </h2>
                    )}

                    {story.author && (
                      <p className="mt-2 text-xl font-bold text-gray-500">
                        {story.author}
                      </p>
                    )}
                  </div>
                )}

                {story.text_format === "poem" ? (
                  <InteractivePoemText
                    chineseText={story.chinese_text}
                    pinyin={story.pinyin}
                  />
                ) : (
                  <InteractiveStoryText
                    chineseText={story.chinese_text}
                    pinyin={story.pinyin}
                  />
                )}

                <div className="mt-10 rounded-2xl bg-green-50/90 p-4">
                  <h2 className="mb-2 text-lg font-bold text-green-700">
                    English Translation
                  </h2>

                  <p className="text-lg text-gray-700">
                    {story.english_translation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
