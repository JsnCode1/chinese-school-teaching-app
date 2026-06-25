import Image from "next/image";
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
      <section className="mx-auto max-w-7xl">
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
            <div
              key={story.id}
              className="rounded-[2rem] bg-white p-8 shadow-xl"
            >
              <div className="grid gap-10 lg:grid-cols-[1.35fr_0.85fr]">
                {/* Story */}
                <div>
                  <InteractiveStoryText
                    chineseText={story.chinese_text}
                    pinyin={story.pinyin}
                  />
                </div>

                {/* Illustration */}
                <div className="flex items-center justify-center">
                  {story.image_path ? (
                    <Image
                      src={story.image_path}
                      alt="Story illustration"
                      width={700}
                      height={700}
                      className="max-h-[700px] w-full rounded-3xl object-contain"
                      priority
                    />
                  ) : (
                    <div className="flex h-[550px] w-full items-center justify-center rounded-3xl bg-orange-100 text-xl font-bold text-gray-400">
                      No illustration
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 rounded-3xl bg-green-50 p-6">
                <h2 className="mb-3 text-2xl font-bold text-green-700">
                  English Translation
                </h2>

                <p className="text-xl leading-relaxed text-gray-700">
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
