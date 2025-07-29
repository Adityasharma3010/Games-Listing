import React, { useEffect, useState } from "react";
import GenreList from "../Components/GenreList";
import GlobalApi from "../Services/GlobalApi";
import Banner from "../Components/Banner";
import TrendingGames from "../Components/TrendingGames";
import GamesByGenreId from "../Components/GamesByGenreId";
import { AnimatePresence, motion } from "framer-motion";

const Home = ({ showMobileGenre, setShowMobileGenre, searchQuery }) => {
  const [allGameList, setAllGameList] = useState([]);
  const [gameListByGenres, setGameListByGenres] = useState([]);
  const [selectedGenresName, setSelectedGenresName] = useState("Action");
  const [activeGenreIndex, setActiveGenreIndex] = useState(0);
  const [randomBannerGame, setRandomBannerGame] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For general API load (search, all games)
  const [isGenreLoading, setIsGenreLoading] = useState(false); // ✅ Only for GamesByGenreId
  const [selectedGenreId, setSelectedGenreId] = useState(4);

  useEffect(() => {
    getAllGamesList();
    getGameListByGenreId(4); // default Action
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResult([]);

      if (gameListByGenres.length > 0) {
        const randomGame =
          gameListByGenres[Math.floor(Math.random() * gameListByGenres.length)];
        setRandomBannerGame(randomGame);
      }
    }
  }, [searchQuery]);

  const getAllGamesList = () => {
    setIsLoading(true);
    GlobalApi.getAllGames().then((resp) => {
      const games = resp.data.results;
      console.log("Games all", games);

      setAllGameList(games);
      const randomGame = games[Math.floor(Math.random() * games.length)];
      setRandomBannerGame(randomGame);
      setIsLoading(false);
    });
  };

  const getGameListByGenreId = (id) => {
    setSelectedGenreId(id);
    setIsGenreLoading(true);
    GlobalApi.getGameListByGenreId(id).then((resp) => {
      setGameListByGenres(resp.data.results);
      console.log("GameListByGenres:", resp.data.results);

      setIsGenreLoading(false);
    });
  };

  const handleSearch = (query) => {
    setIsLoading(true);
    GlobalApi.searchGames(query).then((resp) => {
      const games = resp.data.results;
      console.log("Search: ", resp.data.results);

      const filtered = games.filter(
        (game) =>
          !/wallpaper|fan.?made|mod|soundtrack|demo|pack|episode|demo|utilities|software|tool|chapter|wavelength|dlc|prologue|trial/i.test(
            game.name
          )
      );

      const normalizedQuery = query.trim().toLowerCase();

      const sorted = filtered.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        const aExact = aName === normalizedQuery ? -1 : 0;
        const bExact = bName === normalizedQuery ? -1 : 0;

        if (aExact !== bExact) return aExact - bExact;

        const aIncludes = aName.includes(normalizedQuery) ? 1 : 0;
        const bIncludes = bName.includes(normalizedQuery) ? 1 : 0;

        if (bIncludes !== aIncludes) return bIncludes - aIncludes;

        // If still equal, sort by rating
        return (b.rating || 0) - (a.rating || 0);
      });

      setSearchResult(filtered);
      setIsLoading(false);
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {showMobileGenre && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-55 z-40 md:hidden"
            onClick={() => setShowMobileGenre(false)}
          ></div>
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#121212] shadow-lg z-50 transform transition-all duration-300 md:hidden ${
              showMobileGenre ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <GenreList
              genresId={(id) => {
                getGameListByGenreId(id);
                setShowMobileGenre(false);
              }}
              selectedGenresName={(name) => setSelectedGenresName(name)}
              activeIndex={activeGenreIndex}
              setActiveIndex={setActiveGenreIndex}
              isMobileOpen={true}
              onCloseMobile={() => setShowMobileGenre(false)}
            />
          </div>
        </>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-4 px-4 md:px-0">
        {/* Genre List */}
        <div className="h-full hidden md:block px-4">
          <GenreList
            genresId={(id) => getGameListByGenreId(id)}
            selectedGenresName={(name) => setSelectedGenresName(name)}
            activeIndex={activeGenreIndex}
            setActiveIndex={setActiveGenreIndex}
          />
        </div>

        {/* Game Content */}
        <div className="col-span-4 md:col-span-3 md:pr-4 md:pl-1 pb-5">
          <AnimatePresence mode="wait">
            {!searchQuery && randomBannerGame && (
              <motion.div
                key="banner"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Banner gameBanner={randomBannerGame} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search View */}
          {searchQuery ? (
            isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="loader"></div>
              </div>
            ) : (
              <GamesByGenreId
                gameList={searchResult}
                selectedGenresName="Search"
                enableInfiniteScroll={false}
              />
            )
          ) : (
            <>
              <h2 className="mt-5 font-bold text-3xl dark:text-white">
                Trending Games
              </h2>
              {isGenreLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="loader"></div>
                </div>
              ) : (
                <TrendingGames
                  gameList={[...gameListByGenres]
                    .filter((game) => game.released)
                    .sort((a, b) => new Date(b.released) - new Date(a.released))
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 4)}
                />
              )}

              {/* Genre Game List */}
              <h2 className="font-bold text-3xl dark:text-white mt-5">
                {selectedGenresName} Games
              </h2>
              {isGenreLoading ? (
                <div className="flex justify-center items-center h-40">
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
