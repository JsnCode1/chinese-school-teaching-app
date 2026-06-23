import BackLink from "@/components/BackLink";
import CharacterGrid from "@/components/CharacterGrid";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function CharactersPage({
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

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}`}
          label="Back to lesson"
        />

        <h1 className="mb-8 text-5xl font-bold text-red-700">
          Characters 汉字
        </h1>

        <CharacterGrid characters={(characters as CharacterItem[]) ?? []} />
      </section>
    </main>
  );
}
