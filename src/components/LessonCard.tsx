import Link from "next/link";
import type { Lesson } from "@/lib/types";

export default function LessonCard({
  lesson,
  yearId,
}: {
  lesson: Lesson;
  yearId: string;
}) {
  return (
    <Link
      href={`/year/${yearId}/lesson/${lesson.id}`}
      className="group block rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-red-400 hover:shadow-xl"
    >
      <div className="mb-4 inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">
        Lesson {lesson.lesson_number}
      </div>

      <h2 className="mb-2 text-3xl font-bold text-gray-900">{lesson.title}</h2>
      <p className="mb-6 text-gray-600">{lesson.description}</p>

      <span className="inline-flex rounded-full bg-red-600 px-5 py-3 font-bold text-white transition group-hover:bg-red-700">
        Open Lesson →
      </span>
    </Link>
  );
}
