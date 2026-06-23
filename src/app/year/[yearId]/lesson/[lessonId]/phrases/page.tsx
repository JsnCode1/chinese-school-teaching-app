import BackLink from "@/components/BackLink";
import PhrasePracticeCards from "@/components/PhrasePracticeCards";
import { supabase } from "@/lib/supabase";
import type { Phrase } from "@/lib/types";

export default async function PhrasesPage({
  params,
}: {
  params: Promise<{ yearId: string; lessonId: string }>;
}) {
  const { yearId, lessonId } = await params;

  const { data: phrases, error } = await supabase
    .from("phrases")
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

        <h1 className="mb-6 text-4xl font-bold text-red-700">Phrases 词组</h1>

        <PhrasePracticeCards phrases={(phrases as Phrase[]) ?? []} />
      </section>
    </main>
  );
}
