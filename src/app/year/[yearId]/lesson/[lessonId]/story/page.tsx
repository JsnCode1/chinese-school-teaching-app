import BackLink from "@/components/BackLink";
import { supabase } from "@/lib/supabase";
import type { Story } from "@/lib/types";
import StoryListClient from "@/components/StoryListClient";

export const dynamic = "force-dynamic";

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
    .eq("lesson_id", lessonId)
    .order("order_index", { ascending: true });

  if (error) {
    return <main className="p-8">Error loading story: {error.message}</main>;
  }

  return (
    <main className="min-h-screen bg-orange-50 p-6 md:p-10">
      <section className="mx-auto max-w-6xl">
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

        <StoryListClient stories={stories as Story[] | null} />
      </section>
    </main>
  );
}
