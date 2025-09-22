import React, { useState, useEffect } from "react";
import GenreList from "./GenreList";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const location = useLocation();

  const [selectedGenresName, setSelectedGenresName] = useState("All Games");
  const [activeGenreIndex, setActiveGenreIndex] = useState(null);
  const [selectedGenreId, setSelectedGenreId] = useState("all");

  // ✅ Apply navigation state when redirected from Game page
  useEffect(() => {
    if (location.state?.selectedGenreId) {
      setSelectedGenreId(location.state.selectedGenreId);
      setSelectedGenresName(location.state.selectedGenresName);
      setActiveGenreIndex(location.state.activeGenreIndex);
    }
  }, [location.state]);

  // Mobile menu toggle comes from Home via children props
  const showMobileGenre = children.props.showMobileGenre;
  const setShowMobileGenre = children.props.setShowMobileGenre;

  return (
    <div className="relative grid grid-cols-4 px-4 md:px-0">
      {/* Desktop Genre List */}
      <div className="hidden h-full px-4 md:block">
        <GenreList
          setGenreId={setSelectedGenreId}
          setGenreName={setSelectedGenresName}
          activeIndex={activeGenreIndex}
          setActiveIndex={setActiveGenreIndex}
        />
      </div>

      {/* Mobile Genre Overlay */}
      {showMobileGenre && (
        <div
          className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 md:hidden"
          onClick={() => setShowMobileGenre(false)} // Close on clicking overlay
        >
          <div
            className="bg-white dark:bg-[#121212] h-full w-3/4 p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
          >
            <GenreList
              setGenreId={setSelectedGenreId}
              setGenreName={setSelectedGenresName}
              activeIndex={activeGenreIndex}
              setActiveIndex={setActiveGenreIndex}
            />
          </div>
        </div>
      )}

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
