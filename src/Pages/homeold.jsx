// import React, { useEffect, useState } from "react";
// import GenreList from "../Components/GenreList";
// import GlobalApi from "../Services/GlobalApi";
// import Banner from "../Components/Banner";
// import TrendingGames from "../Components/TrendingGames";
// import GamesByGenreId from "../Components/GamesByGenreId";

// const Home = ({ showMobileGenre, setShowMobileGenre, searchQuery }) => {
//   const [allGameList, setAllGameList] = useState([]);
//   const [gameListByGenres, setGameListByGenres] = useState([]);
//   const [selectedGenresName, setSelectedGenresName] = useState("Action");
//   const [activeGenreIndex, setActiveGenreIndex] = useState(0);
//   const [randomBannerGame, setRandomBannerGame] = useState(null);
//   const [searchResults, setSearchResults] = useState([]);
//   const isSearching = searchQuery.trim().length > 0;

//   useEffect(() => {
//     getAllGamesList();
//     getGameListByGenreId(4); // default: Action
//   }, []);

//   useEffect(() => {
//     if (isSearching) {
//       const filtered = allGameList.filter((game) =>
//         game.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setSearchResults(filtered);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchQuery, isSearching]);

//   const getAllGamesList = () => {
//     GlobalApi.getAllGames().then((resp) => {
//       const games = resp.data.results;
//       setAllGameList(games);
//       const randomGame = games[Math.floor(Math.random() * games.length)];
//       setRandomBannerGame(randomGame);
//     });
//   };

//   const getGameListByGenreId = (id) => {
//     GlobalApi.getGameListByGenreId(id).then((resp) => {
//       setGameListByGenres(resp.data.results);
//     });
//   };

//   return (
//     <>
//       {/* Mobile overlay */}
//       {showMobileGenre && (
//         <>
//           <div
//             className="fixed inset-0 bg-black opacity-55 z-40 md:hidden"
//             onClick={() => setShowMobileGenre(false)}
//           ></div>

//           <div
//             className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#121212] shadow-lg z-50 transform transition-all duration-300 md:hidden ${
//               showMobileGenre ? "translate-x-0" : "-translate-x-full"
//             }`}
//           >
//             <GenreList
//               genresId={(id) => {
//                 getGameListByGenreId(id);
//                 setShowMobileGenre(false);
//               }}
//               selectedGenresName={(name) => setSelectedGenresName(name)}
//               activeIndex={activeGenreIndex}
//               setActiveIndex={setActiveGenreIndex}
//               isMobileOpen={true}
//               onCloseMobile={() => setShowMobileGenre(false)}
//             />
//           </div>
//         </>
//       )}

//       {/* Desktop layout */}
//       <div className="grid grid-cols-4 px-4 md:px-0">
//         {/* Genre List (left) */}
//         <div className="h-full hidden md:block px-4">
//           <GenreList
//             genresId={(id) => getGameListByGenreId(id)}
//             selectedGenresName={(name) => setSelectedGenresName(name)}
//             activeIndex={activeGenreIndex}
//             setActiveIndex={setActiveGenreIndex}
//           />
//         </div>

//         {/* Game Content (right) */}
//         <div className="col-span-4 md:col-span-3 md:pr-4 md:pl-1">
//           {randomBannerGame && <Banner gameBanner={randomBannerGame} />}

//           {!isSearching ? (
//             <>
//               <TrendingGames gameList={allGameList} />
//               <GamesByGenreId
//                 gameList={gameListByGenres}
//                 selectedGenresName={selectedGenresName}
//               />
//             </>
//           ) : (
//             <GamesByGenreId
//               gameList={searchResults}
//               selectedGenresName={"Search Games"}
//             />
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Home;
