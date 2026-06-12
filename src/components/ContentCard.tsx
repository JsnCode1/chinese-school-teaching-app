import { ReactNode } from "react";

type ContentCardProps = {
  chinese: ReactNode;
  pinyin?: string | null;
  english?: string | null;
  extra?: string | null;
};

export default function ContentCard({
  chinese,
  pinyin,
  english,
  extra,
}: ContentCardProps) {
  return (
    <article className="rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-md">
      <h2 className="mb-3 text-4xl font-bold text-red-700">{chinese}</h2>
      {pinyin && <p className="mb-2 text-lg italic text-gray-600">{pinyin}</p>}
      {english && <p className="mb-2 text-gray-800">{english}</p>}
      {extra && (
        <p className="rounded-2xl bg-orange-50 p-3 text-gray-700">
          <strong>Example:</strong> {extra}
        </p>
      )}
    </article>
  );
}
