import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Announcement = {
  id: string;
  title: string;
  message: string;
  announcement_date: string | null;
};

export default async function AnnouncementsPage() {
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("announcement_date", { ascending: false });

  if (error) {
    return (
      <main className="p-8">Error loading announcements: {error.message}</main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <h1 className="mb-8 text-5xl font-bold text-red-700">
        Announcements 公告
      </h1>

      <div className="grid gap-6">
        {announcements?.map((announcement: Announcement) => (
          <article
            key={announcement.id}
            className="rounded-2xl bg-white p-6 shadow"
          >
            <p className="text-sm font-bold text-gray-500">
              {announcement.announcement_date}
            </p>

            <h2 className="mt-2 text-2xl font-bold text-gray-900">
              {announcement.title}
            </h2>

            <p className="mt-3 text-gray-700">{announcement.message}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
