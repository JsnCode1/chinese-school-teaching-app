import dynamic from "next/dynamic";
import BackLink from "@/components/BackLink";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

const PinyinMatchGame = dynamic(() => import("@/components/PinyinMatchGame"), {
  loading: () => (
    <div className="rounded-2xl bg-white p-10 text-center shadow">
      Loading game...
    </div>
  ),
});

export default async function PinyinMatchPage({
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
      <section className="mx-auto max-w-[95vw]">
        <BackLink
          href={`/year/${yearId}/lesson/${lessonId}/games`}
          label="Back to games"
        />

        <h1 className="mb-6 text-5xl font-bold text-red-700">
          Pinyin Match 拼音配对
        </h1>

        <PinyinMatchGame characters={(characters as CharacterItem[]) ?? []} />
      </section>
    </main>
  );
}
