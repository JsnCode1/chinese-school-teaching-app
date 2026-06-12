import Link from "next/link";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="mb-6 inline-block font-bold text-red-700 hover:text-red-900">
      ← {label}
    </Link>
  );
}
