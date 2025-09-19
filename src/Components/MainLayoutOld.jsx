import React, { useState } from "react";
import GenreList from "./GenreList";

const MainLayout = ({ children }) => {
  const [selectedGenresName, setSelectedGenresName] = useState("All Games"); // Default to All Games
  const [activeGenreIndex, setActiveGenreIndex] = useState(0); // 0 is All Games
  const [selectedGenreId, setSelectedGenreId] = useState("all"); // Default to All Games

  return (
    <div className="grid grid-cols-4 px-4 md:px-0">
      {/* Genre List */}
      <div className="hidden h-full px-4 md:block">
        <GenreList
          setGenreId={setSelectedGenreId}
          setGenreName={setSelectedGenresName}
          activeIndex={activeGenreIndex}
          setActiveIndex={setActiveGenreIndex}
        />
      </div>
      {/* Main Content */}
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
