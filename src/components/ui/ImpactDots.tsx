export function ImpactDots({
  level,
  max = 3,
}: {
  level: number;
  max?: number;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < level ? "bg-primary" : "bg-text-muted/40"
          }`}
        />
      ))}
    </div>
  );
}
