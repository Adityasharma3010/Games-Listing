import React, { useEffect, useState, useRef } from "react";
import GlobalApi from "../Services/GlobalApi";
import Banner from "../Components/Banner";
import TrendingGames from "../Components/TrendingGames";
import GamesByGenreId from "../Components/GamesByGenreId";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";

const Home = ({
  searchQuery,
  selectedGenreId,
  selectedGenresName,
  setSelectedGenreId,
  setSelectedGenresName,
}) => {
  const [randomBannerGame, setRandomBannerGame] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtBeginning, setIsAtBeginning] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Fetch all games
  const { data: allGameList = [], isLoading: isAllGamesLoading } = useQuery({
    queryKey: ["allGames"],
    queryFn: () => GlobalApi.getAllGames().then((res) => res.data.results),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch games by genre
  const { data: gameListByGenres = [], isLoading: isGenreLoading } = useQuery({
    queryKey: ["gamesByGenre", selectedGenreId],
    queryFn: () =>
      GlobalApi.getGameListByGenreId(selectedGenreId).then(
        (res) => res.data.results
      ),
    enabled: !!selectedGenreId && selectedGenreId !== "all",
    staleTime: 1000 * 60 * 5,
  });

  // Fetch genres
  const { data: genreList = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: () => GlobalApi.getGenreList().then((resp) => resp.data.results),
    staleTime: 1000 * 60 * 60,
  });

  // Group all games by genre for "All Games" view, always 4 cards (pad with nulls)
  const gamesByGenre = {};
  if (allGameList && genreList) {
    genreList.forEach((genre) => {
      let genreGames = allGameList.filter((game) =>
        game.genres.some((g) => g.id === genre.id)
      );
      if (genreGames.length < 4) {
        genreGames = [
          ...genreGames,
          ...Array(4 - genreGames.length).fill(null),
        ];
      } else {
        genreGames = genreGames.slice(0, 4);
      }
      gamesByGenre[genre.name] = genreGames;
    });
  }

  // Banner logic: from selected genre, or from all games if "All Games" is selected
  useEffect(() => {
    if (searchQuery) return; // Don't change banner on search

    if (selectedGenreId === "all" && allGameList.length > 0) {
      const randomGame =
        allGameList[Math.floor(Math.random() * allGameList.length)];
      setRandomBannerGame(randomGame);
    } else if (
      selectedGenreId !== "all" &&
      gameListByGenres &&
      gameListByGenres.length > 0
    ) {
      const randomGame =
        gameListByGenres[Math.floor(Math.random() * gameListByGenres.length)];
      setRandomBannerGame(randomGame);
    }
  }, [selectedGenreId, allGameList, gameListByGenres, searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResult([]);
    }
  }, [searchQuery]);

  const handleSearch = (query) => {
    setIsLoading(true);
    GlobalApi.searchGames(query).then((resp) => {
      const games = resp.data.results;
      const filtered = games.filter(
        (game) =>
          !/wallpaper|fan.?made|mod|soundtrack|demo|pack|episode|demo|utilities|software|tool|chapter|wavelength|dlc|prologue|trial/i.test(
            game.name
          )
      );
      setSearchResult(filtered);
      setIsLoading(false);
    });
  };

  const swiperRef = useRef(null);
  const trendingRefs = useRef([]);

  const scrollTrending = (dir) => {
    if (swiperRef.current && swiperRef.current.slideNext) {
      if (dir === "left") swiperRef.current.slidePrev();
      else swiperRef.current.slideNext();
    }
  };

  return (
    <>
      {/* Banner always at the top */}
      <AnimatePresence mode="wait">
        {!searchQuery && randomBannerGame && (
          <motion.div
            key={randomBannerGame.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Banner gameBanner={randomBannerGame} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Content */}
      <div className="pb-5">
        {/* Search View */}
        {searchQuery ? (
          isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="loader"></div>
            </div>
          ) : (
            <GamesByGenreId
              gameList={searchResult}
              selectedGenresName="Search"
              enableInfiniteScroll={false}
            />
          )
        ) : selectedGenreId === "all" ? (
          // All Games view: NO trending, just genre sections
          <div className="mt-8">
            {genreList.map((genre, idx) => {
              const games = gamesByGenre[genre.name] || [];
              return (
                <div key={genre.id} className="mb-8">
                  <h2 className="mb-2 text-2xl font-bold dark:text-white">
                    {genre.name}
                  </h2>

                  <TrendingGames
                    gameList={games}
                    swiperRef={(el) => (trendingRefs.current[idx] = el)}
                    setIsAtBeginning={() => {}}
                    setIsAtEnd={() => {}}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          // Normal genre view: show trending and genre games
          <>
            <div className="flex items-center justify-between mt-5">
              <h2 className="text-3xl font-bold dark:text-white">
                Trending Games
              </h2>
              {/* Mobile Swiper Navigation */}
              <div className="flex gap-3 lg:hidden">
                <button
                  onClick={() => scrollTrending("left")}
                  className="bg-[#76a8f75e] hover:bg-[#76a8f7ad] text-black dark:text-white p-2 rounded-full shadow"
                >
                  <HiChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollTrending("right")}
                  className="bg-[#76a8f75e] hover:bg-[#76a8f7ad] text-black dark:text-white p-2 rounded-full shadow"
                >
                  <HiChevronRight size={20} />
                </button>
              </div>
            </div>

            {isGenreLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="loader"></div>
              </div>
            ) : (
              <TrendingGames
                gameList={[...gameListByGenres]
                  .filter((game) => game.released)
                  .sort((a, b) => new Date(b.released) - new Date(a.released))
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 4)}
                swiperRef={swiperRef}
                setIsAtBeginning={setIsAtBeginning}
                setIsAtEnd={setIsAtEnd}
              />
            )}

            {/* Genre Game List */}
            <h2 className="mt-5 text-3xl font-bold dark:text-white">
              {selectedGenresName} Games
            </h2>
            {isGenreLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="loader"></div>
              </div>
            ) : (
              <GamesByGenreId
                gameList={gameListByGenres}
                selectedGenresName={selectedGenresName}
                genreId={selectedGenreId}
              />
            )}
          </>
        )}
      </div>

      {/* Spinner Style */}
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
    </>
  );
};

export default Home;
