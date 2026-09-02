import Link from "next/link";

export default function BackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-red-700 shadow transition hover:bg-red-50"
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </Link>
  );
}
