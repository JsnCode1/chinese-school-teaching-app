import BackLink from "@/components/BackLink";
import ContentCard from "@/components/ContentCard";
import { supabase } from "@/lib/supabase";
import type { CharacterItem } from "@/lib/types";

export default async function CharactersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: characters, error } = await supabase
    .from("characters")
    .select("*")
    .eq("lesson_id", id);

  if (error) return <main className="p-8">Error: {error.message}</main>;

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
        <BackLink href={`/lesson/${id}`} label="Back to lesson" />
        <h1 className="mb-6 text-4xl font-bold text-red-700">Characters 汉字</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(characters as CharacterItem[] | null)?.map((item) => (
            <ContentCard key={item.id} chinese={item.character} pinyin={item.pinyin} english={item.meaning} extra={item.example} />
          ))}
        </div>
      </section>
    </main>
  );
}
