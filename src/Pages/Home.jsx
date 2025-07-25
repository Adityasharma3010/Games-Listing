import React, { useEffect, useState } from "react";
import GenreList from "../Components/GenreList";
import GlobalApi from "../Services/GlobalApi";
import Banner from "../Components/Banner";
import TrendingGames from "../Components/TrendingGames";
import GamesByGenreId from "../Components/GamesByGenreId";

const Home = ({ showMobileGenre, setShowMobileGenre, searchQuery }) => {
  const [allGameList, setAllGameList] = useState([]);
  const [gameListByGenres, setGameListByGenres] = useState([]);
  const [selectedGenresName, setSelectedGenresName] = useState("Action");
  const [activeGenreIndex, setActiveGenreIndex] = useState(0);
  const [randomBannerGame, setRandomBannerGame] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // For general API load (search, all games)
  const [isGenreLoading, setIsGenreLoading] = useState(false); // ✅ Only for GamesByGenreId

  useEffect(() => {
    getAllGamesList();
    getGameListByGenreId(4); // default Action
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      setSearchResult([]);
    }
  }, [searchQuery]);

  const getAllGamesList = () => {
    setIsLoading(true);
    GlobalApi.getAllGames().then((resp) => {
      const games = resp.data.results;
      setAllGameList(games);
      const randomGame = games[Math.floor(Math.random() * games.length)];
      setRandomBannerGame(randomGame);
      setIsLoading(false);
    });
  };

  const getGameListByGenreId = (id) => {
    setIsGenreLoading(true); // ✅ Start genre-only loader
    GlobalApi.getGameListByGenreId(id).then((resp) => {
      setGameListByGenres(resp.data.results);
      setIsGenreLoading(false); // ✅ End loader
    });
  };

  const handleSearch = (query) => {
    setIsLoading(true);
    GlobalApi.getAllGames().then((resp) => {
      const games = resp.data.results;
      const filtered = games.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      );
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
        <div className="col-span-4 md:col-span-3 md:pr-4 md:pl-1">
          {randomBannerGame && <Banner gameBanner={randomBannerGame} />}

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
              />
            )
          ) : (
            <>
              <TrendingGames gameList={allGameList} />
              {/* Genre Game List */}
              {isGenreLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="loader"></div>
                </div>
              ) : (
                <GamesByGenreId
                  gameList={gameListByGenres}
                  selectedGenresName={selectedGenresName}
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
