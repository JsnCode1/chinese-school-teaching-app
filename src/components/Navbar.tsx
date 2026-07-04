import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <Link
          href="/"
          className="text-2xl font-bold text-red-600 hover:text-red-700"
        >
          中文学校
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-semibold text-gray-700 hover:text-red-600"
          >
            Home
          </Link>

          <Link
            href="/announcements"
            className="font-semibold text-gray-700 hover:text-red-600"
          >
            Announcements
          </Link>
        </div>
      </div>
    </nav>
  );
}
