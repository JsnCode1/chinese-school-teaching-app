import BackLink from "@/components/BackLink";
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

  if (error) {
    return <main className="p-8">Error loading story: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-5xl">
        <BackLink href={`/lesson/${id}`} label="Back to lesson" />

        <h1 className="mb-8 text-5xl font-bold text-red-700">课文 上餐馆</h1>

        <div className="space-y-8">
          {stories?.map((story: Story) => {
            const chineseChars = story.chinese_text.split("");
            const pinyinWords = story.pinyin?.split(" ") ?? [];

            let pinyinIndex = 0;

            return (
              <div
                key={story.id}
                className="rounded-3xl bg-white p-8 shadow-lg"
              >
                {/* Chinese characters with pinyin ABOVE */}
                <div className="flex flex-wrap gap-4">
                  {chineseChars.map((char, index) => {
                    const isPunctuation = "，。！？；：,.!?;:（）() ".includes(
                      char,
                    );

                    const pinyin = isPunctuation
                      ? ""
                      : (pinyinWords[pinyinIndex++] ?? "");

                    return (
                      <div key={index} className="flex flex-col items-center">
                        {!isPunctuation && (
                          <span className="text-sm text-red-600 font-medium">
                            {pinyin}
                          </span>
                        )}

                        <span className="text-3xl font-bold text-gray-900">
                          {char}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* English translation */}
                <div className="mt-10 rounded-2xl bg-green-50 p-4">
                  <h2 className="mb-2 text-lg font-bold text-green-700">
                    英文翻译 CAN BE ADDED LATER
                  </h2>

                  <p className="text-lg text-gray-700">
                    {story.english_translation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
