import BackLink from "@/components/BackLink";
import OptionCard from "@/components/OptionCard";
import { supabase } from "@/lib/supabase";
import type { Lesson } from "@/lib/types";

export default async function LessonOverviewPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;

  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (error || !lesson) {
    return (
      <main className="min-h-screen bg-orange-50 p-8">
        <BackLink href={`/year/${yearId}`} label="Back to lessons" />
        <p className="rounded-2xl bg-white p-4 text-red-700 shadow">
          Lesson not found.
        </p>
      </main>
    );
  }

  const currentLesson = lesson as Lesson;

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 p-6 md:p-10">
      <section className="mx-auto max-w-5xl">
        <BackLink href={`/year/${yearId}`} label="Back to lessons" />

        <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-lg">
          <p className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
            Lesson {currentLesson.lesson_number}
          </p>

          <h1 className="text-5xl font-extrabold text-gray-900">
            {currentLesson.title}
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            {currentLesson.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <OptionCard
            title="Story"
            description="Read the story in Chinese, pinyin, and English."
            href={`/year/${yearId}/lesson/${lessonId}/story`}
            emoji="课文"
          />

          <OptionCard
            title="Characters"
            description="Learn important Chinese characters."
            href={`/year/${yearId}/lesson/${lessonId}/characters`}
            emoji="汉字"
          />

          <OptionCard
            title="Phrases"
            description="Practise useful phrases from the lesson."
            href={`/year/${yearId}/lesson/${lessonId}/phrases`}
            emoji="词语"
          />

          <OptionCard
            title="Short Sentences"
            description="Read and practise simple sentences."
            href={`/year/${yearId}/lesson/${lessonId}/sentences`}
            emoji="句子"
          />
          <OptionCard
            title="Games"
            description="Match pinyin to the correct Chinese characters."
            href={`/year/${yearId}/lesson/${lessonId}/games`}
            emoji="游戏"
          />
        </div>
      </section>
    </main>
  );
}
