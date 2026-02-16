import type { WatchlistIdea } from "@/lib/types";
import { WatchlistIdeaCard } from "./WatchlistIdeaCard";

export function WatchlistIdeasList({ ideas }: { ideas: WatchlistIdea[] }) {
  return (
    <div className="space-y-4">
      {ideas.map((idea) => (
        <WatchlistIdeaCard key={idea.ticker} idea={idea} />
      ))}
    </div>
  );
}
