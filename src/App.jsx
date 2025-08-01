import React, { useState } from "react";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import { ThemeConstant } from "./Context/ThemeContext";

const App = () => {
  const [showMobileGenre, setShowMobileGenre] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  return (
    <ThemeConstant.Provider value={{ theme, setTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>
        <div className="bg-white dark:bg-[#121212] min-h-screen">
          <Header
            onToggleGenre={() => setShowMobileGenre(!showMobileGenre)}
            onSearch={(query) => setSearchQuery(query)}
          />
          <Home
            showMobileGenre={showMobileGenre}
            setShowMobileGenre={setShowMobileGenre}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </ThemeConstant.Provider>
  );
};

export default App;
