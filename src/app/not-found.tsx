import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <span className="material-icons-round text-6xl text-primary mb-4">
        search_off
      </span>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-sm text-text-muted mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-bg-dark font-bold rounded-xl hover:bg-primary-light transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
