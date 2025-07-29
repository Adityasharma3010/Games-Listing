import React, { useEffect, useState } from "react";
import GlobalApi from "../Services/GlobalApi";

const GenreList = ({
  genresId,
  selectedGenresName,
  isMobileOpen,
  onCloseMobile,
  activeIndex,
  setActiveIndex,
  setIsGenreLoading, // ✅ loader setter
}) => {
  const [genreList, setGenreList] = useState([]);

  useEffect(() => {
    getGenreList();
  }, []);

  const getGenreList = () => {
    GlobalApi.getGenreList()
      .then((resp) => {
        setGenreList(resp.data.results);
      })
      .catch((err) => {
        console.error("Failed to fetch genre list:", err);
      });
  };

  const handleGenreClick = (item, index) => {
    if (activeIndex != index) {
      setActiveIndex(index); // use lifted state
      genresId(item.id);
      selectedGenresName(item.name);
      if (onCloseMobile) onCloseMobile();
    } // close on mobile
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
        className={`dark:text-white text-lg group-hover:font-bold transition-all ease-in duration-300 ${
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[30px] font-bold dark:text-white">Genre</h2>
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="text-xl bg-slate-300 dark:bg-slate-700 px-3 py-1 rounded dark:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {genreList.map((item, index) => renderGenreItem(item, index))}
    </div>
  );
};

export default GenreList;
