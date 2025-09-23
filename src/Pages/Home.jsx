import React, { useEffect, useState, useRef } from "react";
import GlobalApi from "../Services/GlobalApi";
import Banner from "../Components/Banner";
import TrendingGames from "../Components/TrendingGames";
import GamesByGenreId from "../Components/GamesByGenreId";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Home = ({
  searchQuery,
  setSearchQuery, // ✅ new prop
  selectedGenreId,
  selectedGenresName,
  setSelectedGenreId,
  setSelectedGenresName,
}) => {
  const [randomBannerGame, setRandomBannerGame] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allGameList, setAllGameList] = useState([]);
  const [isAllGamesLoading, setIsAllGamesLoading] = useState(false);
  const [gameListByGenres, setGameListByGenres] = useState([]);
  const [isGenreLoading, setIsGenreLoading] = useState(false);
  const [genreList, setGenreList] = useState([]);

  const swiperRef = useRef(null);

  useEffect(() => {
    if (!selectedGenreId) {
      setSelectedGenreId("all");
      setSelectedGenresName("All Games");
    }
  }, []);

  // Fetch genres
  useEffect(() => {
    GlobalApi.getGenreList().then((res) =>
      setGenreList(res.data.results || [])
    );
  }, []);

  // Fetch first page of all games
  useEffect(() => {
    if (selectedGenreId === "all" && allGameList.length === 0) {
      setIsAllGamesLoading(true);
      GlobalApi.getAllGames(1).then((res) => {
        setAllGameList(res.data.results || []);
        setIsAllGamesLoading(false);
      });
    }
  }, [selectedGenreId]);

  // Fetch genre-specific games
  useEffect(() => {
    if (selectedGenreId && selectedGenreId !== "all") {
      setIsGenreLoading(true);
      GlobalApi.getGameListByGenreId(selectedGenreId).then((res) => {
        setGameListByGenres(res.data.results || []);
        setIsGenreLoading(false);
      });
    }
  }, [selectedGenreId]);

  // Banner logic
  useEffect(() => {
    if (searchQuery) return;

    if (selectedGenreId === "all" && allGameList.length > 0) {
      setRandomBannerGame(
        allGameList[Math.floor(Math.random() * allGameList.length)]
      );
    } else if (
      selectedGenreId !== "all" &&
      gameListByGenres &&
      gameListByGenres.length > 0
    ) {
      setRandomBannerGame(
        gameListByGenres[Math.floor(Math.random() * gameListByGenres.length)]
      );
    }
  }, [selectedGenreId, allGameList, gameListByGenres, searchQuery]);

  // Handle search
  const handleSearch = (query) => {
    setIsLoading(true);
    GlobalApi.searchGames(query).then((resp) => {
      const filtered = resp.data.results.filter(
        (game) =>
          !/wallpaper|fan.?made|mod|soundtrack|demo|pack|episode|utilities|software|tool|chapter|dlc|prologue|trial/i.test(
            game.name
          )
      );
      setSearchResult(filtered);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (searchQuery) handleSearch(searchQuery);
    else setSearchResult([]);
  }, [searchQuery]);

  const scrollTrending = (dir) => {
    if (swiperRef.current && swiperRef.current.slideNext) {
      if (dir === "left") swiperRef.current.slidePrev();
      else swiperRef.current.slideNext();
    }
  };

  return (
    <>
      {/* Banner */}
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
              genreId="search"
              setSearchQuery={setSearchQuery} // ✅ pass it down
            />
          )
        ) : selectedGenreId === "all" ? (
          <div className="mt-8">
            <h2 className="mb-2 text-xl sm:text-[22px] md:text-3xl font-bold press dark:text-white">
              All Games
            </h2>
            <GamesByGenreId
              gameList={allGameList}
              selectedGenresName="All"
              enableInfiniteScroll={true}
              genreId="all"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mt-5">
              <h2 className="text-xl sm:text-[22px] md:text-3xl font-bold press dark:text-white">
                Trending Games
              </h2>
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
                setIsAtBeginning={() => {}}
                setIsAtEnd={() => {}}
              />
            )}

            <h2 className="mt-5 text-xl sm:text-[22px] md:text-3xl font-bold press dark:text-white">
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
                enableInfiniteScroll={true}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
