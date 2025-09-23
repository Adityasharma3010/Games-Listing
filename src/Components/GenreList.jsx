import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GlobalApi from "../Services/GlobalApi";
import { useLocation, useNavigate } from "react-router-dom";

const ALL_GAMES_ID = "all";

const GenreList = ({
  setGenreId,
  setGenreName,
  isMobileOpen,
  onCloseMobile,
  activeIndex,
  setActiveIndex,
  setIsGenreLoading,
  searchQuery, // 🔹 new prop
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use React Query for genres
  const { data: genreList = [], isLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => GlobalApi.getGenreList().then((resp) => resp.data.results),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Add "All Games" at the top
  const allGamesItem = {
    id: ALL_GAMES_ID,
    name: "All Games",
    image_background:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80",
  };

  const genresWithAll = [allGamesItem, ...genreList];

  // 🔹 Ensure correct active genre based on route & search
  useEffect(() => {
    if (location.pathname === "/" && !searchQuery) {
      // Home with no search → All Games active
      setActiveIndex(0);
      setGenreId(ALL_GAMES_ID);
      setGenreName("All Games");
    } else {
      // Game page OR search active → clear selection
      setActiveIndex(null);
    }
  }, [
    location.pathname,
    searchQuery,
    setActiveIndex,
    setGenreId,
    setGenreName,
  ]);

  const handleGenreClick = (item, index) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      setGenreId(item.id);
      setGenreName(item.name);
      if (onCloseMobile) onCloseMobile();

      if (location.pathname !== "/") {
        navigate("/", {
          state: {
            selectedGenreId: item.id,
            selectedGenresName: item.name,
            activeGenreIndex: index,
          },
        });
      }
    }
  };

  const renderGenreItem = (item, index) => (
    <div
      key={item.id}
      className={`group flex flex-row gap-2 items-center mb-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 p-2
         rounded-lg ${
           activeIndex === index ? "bg-gray-300 dark:bg-gray-600" : ""
         }`}
      onClick={() => handleGenreClick(item, index)}
    >
      <img
        src={item.image_background}
        alt={item.name}
        className={`w-[40px] h-[40px] object-cover rounded-lg group-hover:scale-105 transition-all ease-in duration-300 ${
          activeIndex === index ? "scale-105" : ""
        }`}
      />
      <h3
        className={`dark:text-white text-lg orbitron truncate group-hover:font-bold transition-all ease-in duration-300 ${
          activeIndex === index ? "font-bold" : ""
        }`}
      >
        {item.name}
      </h3>
    </div>
  );

  return (
    <div
      className={`${
        isMobileOpen
          ? "fixed inset-0 bg-white dark:bg-slate-900 z-50 p-4 overflow-y-auto md:hidden"
          : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-[22px] md:text-3xl font-bold press dark:text-white">
          Genre
        </h2>
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="px-3 py-1 text-xl rounded bg-slate-300 dark:bg-slate-700 dark:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-20">
          <div className="loader"></div>
        </div>
      ) : (
        genresWithAll.map((item, index) => renderGenreItem(item, index))
      )}
    </div>
  );
};

export default GenreList;
