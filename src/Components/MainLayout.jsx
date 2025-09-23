import React, { useState, useEffect } from "react";
import GenreList from "./GenreList";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

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
      <AnimatePresence>
        {showMobileGenre && (
          <motion.div
            className="fixed top-0 left-0 z-50 w-full h-full bg-black/50 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileGenre(false)}
          >
            <motion.div
              className="relative bg-white dark:bg-[#121212] h-full w-3/4 p-4"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute p-2 transition rounded-full top-3 right-3 hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => setShowMobileGenre(false)}
              >
                <HiX className="text-2xl dark:text-white" />
              </button>

              {/* Genre List */}
              <GenreList
                setGenreId={setSelectedGenreId}
                setGenreName={setSelectedGenresName}
                activeIndex={activeGenreIndex}
                setActiveIndex={setActiveGenreIndex}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
