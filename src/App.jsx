import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import Game from "./Pages/Game";
import MainLayout from "./Components/MainLayout";
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
          <BrowserRouter>
            <Header
              onToggleGenre={() => setShowMobileGenre(!showMobileGenre)}
              onSearch={(query) => setSearchQuery(query)}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Home
                      showMobileGenre={showMobileGenre}
                      setShowMobileGenre={setShowMobileGenre}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery} // ✅ pass setSearchQuery
                    />
                  </MainLayout>
                }
              />
              <Route
                path="/game/:id"
                element={
                  <MainLayout>
                    <Game
                      showMobileGenre={showMobileGenre}
                      setShowMobileGenre={setShowMobileGenre}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery} // ✅ pass setSearchQuery
                    />
                  </MainLayout>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </ThemeConstant.Provider>
  );
};

export default App;
