import React, { useState, useEffect } from "react";
import GenreList from "./GenreList";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const [selectedGenresName, setSelectedGenresName] = useState("All Games");
  const [activeGenreIndex, setActiveGenreIndex] = useState(0);
  const [selectedGenreId, setSelectedGenreId] = useState("all");

  // ✅ Apply navigation state when redirected from Game page
  useEffect(() => {
    if (location.state?.selectedGenreId) {
      setSelectedGenreId(location.state.selectedGenreId);
      setSelectedGenresName(location.state.selectedGenresName);
      setActiveGenreIndex(location.state.activeGenreIndex);
    }
  }, [location.state]);

  return (
    <div className="grid grid-cols-4 px-4 md:px-0">
      <div className="hidden h-full px-4 md:block">
        <GenreList
          setGenreId={setSelectedGenreId}
          setGenreName={setSelectedGenresName}
          activeIndex={activeGenreIndex}
          setActiveIndex={setActiveGenreIndex}
        />
      </div>
      <div className="col-span-4 md:col-span-3 md:pr-4 md:pl-1">
        {React.cloneElement(children, {
          selectedGenreId,
          selectedGenresName,
          activeGenreIndex,
          setSelectedGenreId,
          setSelectedGenresName,
          setActiveGenreIndex,
        })}
      </div>
    </div>
  );
};

export default MainLayout;
