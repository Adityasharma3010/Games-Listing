import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GlobalApi from "../Services/GlobalApi";
import GamesByGenreId from "../Components/GamesByGenreId";

const Game = ({ searchQuery, setSearchQuery }) => {
  const { id } = useParams();
  const [searchResult, setSearchResult] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  // Track window resize for responsive tag count
  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      </div>
    ) : (
      <GamesByGenreId
        key={searchQuery}
        gameList={searchResult}
        selectedGenresName="Search"
        enableInfiniteScroll={false}
        genreId="search"
        setSearchQuery={setSearchQuery}
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

  // Responsive tag logic
  const visibleTagCount = showAllTags ? game.tags.length : isMd ? 5 : 2;
  const visibleTags = game.tags?.slice(0, visibleTagCount) || [];
  const hiddenCount = game.tags?.length - visibleTagCount || 0;

  return (
    <div className="pb-5 mx-auto space-y-6 md:px-4 lg:px-8">
      {/* Game Title */}
      <h1 className="mb-4 text-3xl font-bold monoton bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 dark:from-cyan-400 dark:via-fuchsia-500 dark:to-purple-600 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient font-cy">
        {game.name}
      </h1>

      {/* Background Image */}
      {game.background_image && (
        <div
          className="relative w-full rounded-lg p-1 bg-gradient-to-r from-purple-800 via-blue-500 to-pink-600
                  bg-[length:300%_300%] animate-gradient animate-neon
                  dark:from-purple-700 dark:via-fuchsia-500 dark:to-cyan-400 dark:bg-[length:400%_400%]"
        >
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-800 share-tech-mono sm:text-base md:text-lg dark:text-gray-300">
        {game.description_raw}
      </p>

      {/* Developers */}
      {game.developers?.length > 0 && (
        <div className="text-sm sm:text-base md:text-lg text-cyan-400 audiowide">
          <strong>Developers:</strong>{" "}
          {game.developers.map((dev) => dev.name).join(", ")}
        </div>
      )}

      {/* Publishers */}
      {game.publishers?.length > 0 && (
        <div className="text-sm text-purple-400 sm:text-base md:text-lg audiowide">
          <strong>Publishers:</strong>{" "}
          {game.publishers.map((pub) => pub.name).join(", ")}
        </div>
      )}

      {/* Tags */}
      {game.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-pink-600 sm:text-base md:text-lg monoton dark:text-pink-400">
          <strong>Tags:</strong>{" "}
          {visibleTags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 transition rounded-md cursor-default bg-pink-100/50 dark:bg-gray-800/50 hover:bg-pink-200/70 dark:hover:bg-gray-800/80
                   hover:drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.7)]"
            >
              {tag.name}
            </span>
          ))}
          {/* Show remaining button */}
          {hiddenCount > 0 && !showAllTags && (
            <button
              onClick={() => setShowAllTags(true)}
              className="px-2 py-1 transition rounded-md cursor-pointer bg-pink-100/50 dark:bg-gray-800/50 hover:bg-pink-200/70 dark:hover:bg-gray-800/80
                   hover:drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.7)]"
            >
              +{hiddenCount} more
            </button>
          )}
          {/* Futuristic Hide button */}
          {showAllTags && (
            <button
              onClick={() => setShowAllTags(false)}
              className="flex items-center justify-center w-8 h-8 px-2 py-1 text-sm transition border border-pink-500 dark:border-pink-400 rounded-full cursor-pointer bg-pink-100/70 dark:bg-gray-900/70
                   hover:bg-pink-400/30 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.7)]"
              title="Collapse tags"
            >
              <span className="text-lg font-bold text-pink-500 dark:text-pink-400">
                ⟲
              </span>
            </button>
          )}
        </div>
      )}

      {/* Stores */}
      {game.stores?.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-green-400 sm:text-base md:text-lg audiowide dark:text-green-300">
          <strong>Available on:</strong>{" "}
          {game.stores.map((storeObj) => {
            const storeUrls = {
              steam: "https://store.steampowered.com/",
              "epic-games": "https://www.epicgames.com/store/",
              gog: "https://www.gog.com/",
              "playstation-store": "https://store.playstation.com/",
              "xbox-store": "https://www.xbox.com/en-US/games/store",
              xbox360: "https://www.xbox.com/en-US/games/store",
              nintendo: "https://www.nintendo.com/store/",
              "apple-appstore": "https://www.apple.com/app-store/",
              "google-play": "https://play.google.com/",
              itch: "https://itch.io/",
            };

            const storeUrl =
              storeObj.url || storeUrls[storeObj.store.slug] || "#";

            return (
              <a
                key={storeObj.store.id}
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 transition border border-green-400 rounded-md hover:bg-green-400/20 
                     hover:drop-shadow-[0_0_6px_rgba(0,255,128,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(0,255,128,0.9)]"
              >
                {storeObj.store.name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Game;
