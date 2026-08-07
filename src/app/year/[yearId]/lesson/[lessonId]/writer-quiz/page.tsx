import BackLink from "@/components/BackLink";
import WriterQuiz from "@/components/WriterQuiz";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function WriterQuizPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;

  const { data: characters, error } = await supabase
    .from("characters")
    .select("*")
    .eq("lesson_id", lessonId);

  if (error) {
    return (
      <main className="p-8">Error loading characters: {error.message}</main>
    );
  }

  const items = (characters as CharacterItem[]) ?? [];

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <h1 className="mb-6 text-4xl font-bold text-red-700">Writer Quiz</h1>

        <div className="rounded-2xl bg-white p-6 shadow">
          {/* Pass characters array to client component */}
          <WriterQuiz characters={items} />
        </div>
      </section>
    </main>
  );
}
