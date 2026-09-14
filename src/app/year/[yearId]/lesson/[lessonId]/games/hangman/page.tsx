import dynamic from "next/dynamic";
import BackLink from "@/components/BackLink";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

const HangmanGame = dynamic(() => import("@/components/HangmanGame"), {
  loading: () => (
    <div className="rounded-2xl bg-white p-10 text-center shadow">
      Loading Hangman...
    </div>
  ),
});

export default async function HangmanPage({
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
    return <main className="p-8">Error loading game: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}/games`}
          label="Back to games"
        />

        <h1 className="mb-6 text-5xl font-bold text-red-700">
          Pinyin Hangman 猜拼音
        </h1>

        <HangmanGame characters={(characters as CharacterItem[]) ?? []} />
      </section>
    </main>
  );
}
