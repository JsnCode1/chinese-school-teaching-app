import Link from "next/link";

type OptionCardProps = {
  title: string;
  description: string;
  href: string;
  emoji: string;
};

export default function OptionCard({ title, description, href, emoji }: OptionCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-3xl border-2 border-orange-200 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:border-red-400 hover:shadow-xl"
    >
      <div className="mb-3 text-5xl">{emoji}</div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
