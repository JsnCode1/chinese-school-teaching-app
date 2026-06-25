import BackLink from "@/components/BackLink";
import PinyinRaceGame from "@/components/PinyinRaceGame";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function RacePage({
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
    return <main className="p-8">Error loading race: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-3 md:p-5">
      <section className="mx-auto w-full max-w-[95vw]">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <PinyinRaceGame characters={(characters as CharacterItem[]) ?? []} />
      </section>
    </main>
  );
}
