import React from "react";
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
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80", // or any default image
  };

  const genresWithAll = [allGamesItem, ...genreList];

  const handleGenreClick = (item, index) => {
    if (activeIndex !== index) {
      setActiveIndex(index);
      setGenreId(item.id); // Correct: updates selectedGenreId in Home
      setGenreName(item.name); // Correct: updates selectedGenresName in Home
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
        <h2 className="text-[30px] font-bold dark:text-white">Genre</h2>
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

      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GenreList;
