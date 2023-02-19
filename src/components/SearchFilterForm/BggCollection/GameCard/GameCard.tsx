import type { BoardGame, CollectionFilterState } from "@/types";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { PlayerCountChart } from "./PlayerCountChart";

type Props = {
  game: BoardGame;
  filterState: CollectionFilterState;
};

export const GameCard = ({ game, filterState }: Props) => (
  <Card>
    <CardContent>
      <a
        className="block min-w-0 truncate text-2xl font-normal text-black no-underline decoration-1 hover:underline"
        href={`https://boardgamegeek.com/${game.type}/${game.id}`}
      >
        {game.name}
      </a>

      <div className="mt-2 flex justify-between">
        <CardMedia
          className="max-h-40 min-w-fit object-contain p-4"
          component="img"
          src={game.thumbnail}
          alt={`${game.name} thumbnail`}
        />

        <dl className="my-2 min-w-fit">
          <dt className="text-xs text-gray-500">User Rating</dt>
          <dd className="mb-2 ml-0 text-2xl">
            {game.userRating}{" "}
            {game.userRating !== "N/A" && (
              <span className="text-xs text-gray-500">/ 10</span>
            )}
          </dd>

          <dt className="text-xs text-gray-500">Average Rating</dt>
          <dd className="mb-2 ml-0 text-2xl">
            {game.averageRating}{" "}
            <span className="text-xs text-gray-500">/ 10</span>
          </dd>

          <dt className="text-xs text-gray-500">Time (minutes)</dt>
          <dd className="mb-2 ml-0 text-2xl">
            {game.minPlaytime === game.maxPlaytime
              ? `${game.maxPlaytime}`
              : `${game.minPlaytime} - ${game.maxPlaytime}`}
          </dd>

          <dt className="text-xs text-gray-500">Complexity</dt>
          <dd className="ml-0 text-2xl">
            {game.averageWeight}{" "}
            <span className="text-xs text-gray-500">/ 5</span>
          </dd>
        </dl>
      </div>

      <PlayerCountChart
        gameId={game.id}
        recommendedPlayerCount={game.recommendedPlayerCount}
        filterState={filterState}
      />
    </CardContent>
  </Card>
);
