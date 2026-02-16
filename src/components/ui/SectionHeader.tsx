import Link from "next/link";

export function SectionHeader({
  icon,
  title,
  viewAllHref,
}: {
  icon: string;
  title: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="material-icons-round text-primary text-xl">{icon}</span>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
        >
          View All →
        </Link>
      )}
    </div>
  );
}
