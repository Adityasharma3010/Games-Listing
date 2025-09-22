import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GlobalApi from "../Services/GlobalApi";
import GamesByGenreId from "../Components/GamesByGenreId";

const Game = ({ searchQuery, setSearchQuery }) => {
  const { id } = useParams();
  const [searchResult, setSearchResult] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  // Handle search query
  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);
      setIsLoadingSearch(false);
      return;
    }

    setSearchResult([]);
    setIsLoadingSearch(true);

    GlobalApi.searchGames(searchQuery).then((resp) => {
      const filtered = resp.data.results.filter(
        (game) =>
          !/wallpaper|fan.?made|mod|soundtrack|demo|pack|episode|utilities|software|tool|chapter|dlc|prologue|trial/i.test(
            game.name
          )
      );
      setSearchResult(filtered);
      setIsLoadingSearch(false);
    });
  }, [searchQuery]);

  // Normal game fetch
  const { data: game, isLoading: isLoadingGame } = useQuery({
    queryKey: ["gameDetails", id],
    queryFn: () => GlobalApi.getGameDetails(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  // 🔹 Render search results if searchQuery exists
  if (searchQuery) {
    return isLoadingSearch ? (
      <div className="flex items-center justify-center h-40">
        <div className="loader"></div>
        <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    ) : (
      <GamesByGenreId
        key={searchQuery} // force re-render on new search
        gameList={searchResult}
        selectedGenresName="Search"
        enableInfiniteScroll={false}
        genreId="search"
        setSearchQuery={setSearchQuery} // allow clearing search on click
      />
    );
  }

  // Render single game page
  if (isLoadingGame)
    return (
      <div className="flex items-center justify-center h-40">
        <div className="loader"></div>
      </div>
    );

  if (!game) return <div>Game not found.</div>;

  return (
    <div className="mx-auto">
      <h1 className="mb-4 text-3xl font-bold monoton bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 dark:from-cyan-400 dark:via-fuchsia-500 dark:to-purple-600 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient font-cy">
        {game.name}
      </h1>
      <img
        src={game.background_image}
        alt={game.name}
        className="w-full mb-4 rounded-lg"
      />
      <p className="dark:text-white orbitron">{game.description_raw}</p>
    </div>
  );
};

export default Game;
