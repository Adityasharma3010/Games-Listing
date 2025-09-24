import React, { useContext, useState, useEffect, useRef } from "react";
import logo from "./../assets/Images/logo.png";
import { HiOutlineMagnifyingGlass, HiMoon, HiSun } from "react-icons/hi2";
import { ThemeConstant } from "../Context/ThemeContext";
import { FiMenu } from "react-icons/fi";
import GlobalApi from "../Services/GlobalApi";

const Header = ({ onToggleGenre, onSearch }) => {
  const { theme, setTheme } = useContext(ThemeConstant);
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const skipNextEffect = useRef(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]); // Close dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (skipNextEffect.current) {
      skipNextEffect.current = false;
      return;
    }

    if (searchInput.trim()) {
      GlobalApi.searchGames(searchInput).then((resp) => {
        const filtered = resp.data.results;
        setSuggestions(filtered.slice(0, 5));
      });
    } else {
      setSuggestions([]);
      onSearch(""); // Trigger layout reset when input is cleared
    }
  }, [searchInput]);

  const handleSearch = (value = searchInput.trim()) => {
    if (value) {
      onSearch(value);
      setSuggestions([]); // ✅ Close suggestions on search
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col z-50 bg-white dark:bg-[#121212] sticky top-0">
      <div className="flex flex-row items-center p-3">
        <a
          href={window.location.origin}
          className="w-[60px] relative block glitch-logo before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:opacity-70 before:mix-blend-screen after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:opacity-70 after:mix-blend-screen"
        >
          <img
            src={logo}
            alt="logo"
            className="max-w-[60px] w-full min-w-[60px] h-[60px] block"
          />
        </a>

        <div className="block -order-1 md:order-0 md:hidden w-[60px] h-[60px] flex items-center justify-center">
          <FiMenu
            className="text-[30px] cursor-pointer dark:text-white text-black"
            onClick={onToggleGenre}
          />
        </div>

        <div
          ref={searchRef}
          className="relative flex flex-row items-center w-full p-2 mx-5 rounded-full bg-slate-200 dark:bg-slate-700"
        >
          <HiOutlineMagnifyingGlass
            className="cursor-pointer dark:stroke-white"
            onClick={() => handleSearch()}
          />
          <input
            type="text"
            placeholder="Search Games"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 audiowide text-black bg-transparent outline-none dark:text-white"
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 z-50 w-full mt-1 overflow-y-auto bg-white rounded-lg shadow-lg top-full dark:bg-gray-800 max-h-60">
              {suggestions.map((game) => (
                <div
                  key={game.id}
                  onClick={() => {
                    setSearchInput(game.name);
                    skipNextEffect.current = true; // ✅ Prevent refetch
                    handleSearch(game.name);
                    setSuggestions([]); // ✅ Close dropdown
                  }}
                  className="px-4 py-2 audiowide text-black cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 dark:text-white"
                >
                  {game.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {theme === "light" ? (
            <HiSun
              className="bg-slate-200 text-[35px] text-[#FFBF00] p-1 rounded-full cursor-pointer transition duration-300 hover:drop-shadow-[0_0_8px_#FFBF00] hover:animate-pulse-glow sun"
              onClick={() => {
                setTheme("dark");
                localStorage.setItem("theme", "dark");
              }}
            />
          ) : (
            <HiMoon
              className="bg-slate-700 text-[35px] text-white p-1 rounded-full cursor-pointer transition duration-300 hover:drop-shadow-[0_0_8px_#ffffff] hover:animate-pulse-glow-white moon"
              onClick={() => {
                setTheme("light");
                localStorage.setItem("theme", "light");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
