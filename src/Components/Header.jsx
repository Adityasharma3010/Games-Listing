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
  const skipNextEffect = useRef(false); // ✅ Flag to skip effect

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
        <a href={window.location.origin} className="w-[60px]">
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

        <div className="relative flex flex-row bg-slate-200 dark:bg-slate-700 p-2 w-full items-center mx-5 rounded-full">
          <HiOutlineMagnifyingGlass
            className="cursor-pointer"
            onClick={() => handleSearch()}
          />
          <input
            type="text"
            placeholder="Search Games"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none px-2 w-full text-black dark:text-white"
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {suggestions.map((game) => (
                <div
                  key={game.id}
                  onClick={() => {
                    setSearchInput(game.name);
                    skipNextEffect.current = true; // ✅ Prevent refetch
                    handleSearch(game.name);
                    setSuggestions([]); // ✅ Close dropdown
                  }}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer text-black dark:text-white"
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
              className="bg-slate-200 text-[35px] text-black p-1 rounded-full cursor-pointer"
              onClick={() => {
                setTheme("dark");
                localStorage.setItem("theme", "dark");
              }}
            />
          ) : (
            <HiMoon
              className="bg-slate-200 text-[35px] text-black p-1 rounded-full cursor-pointer"
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
