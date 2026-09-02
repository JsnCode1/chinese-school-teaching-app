import Link from "next/link";

export default async function LessonMissingPage({
  params,
}: {
  params: Promise<{ yearId: string }>;
}) {
  const { yearId } = await params;

  return (
    <main className="min-h-screen bg-orange-50 p-8">
      <Link
        href={`/year/${yearId}`}
        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-red-700 shadow transition hover:bg-red-50"
      >
        <span aria-hidden="true">←</span>
        <span>Back to lessons</span>
      </Link>

      <section className="mx-auto mt-8 max-w-2xl rounded-[2rem] bg-white p-8 shadow-lg">
        <p className="mb-3 inline-block rounded-full bg-red-100 px-4 py-2 font-bold text-red-700">
          Lesson not found
        </p>

        <h1 className="text-4xl font-extrabold text-gray-900">
          No lesson was selected.
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Please choose a lesson from the year page to continue.
        </p>
      </section>
    </main>
  );
}
