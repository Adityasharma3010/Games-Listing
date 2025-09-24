import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GlobalApi from "../Services/GlobalApi";
import GamesByGenreId from "../Components/GamesByGenreId";

const Game = ({ searchQuery, setSearchQuery }) => {
  const { slug } = useParams(); // now we use slug
  const [gameId, setGameId] = useState(null); // store actual ID
  const [searchResult, setSearchResult] = useState([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch ID from slug
  useEffect(() => {
    if (!slug) return;
    GlobalApi.searchGames(slug).then((res) => {
      const filtered = res.data.results.filter((g) => g.slug === slug);
      if (filtered.length > 0) setGameId(filtered[0].id);
    });
  }, [slug]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchResult([]);
      setIsLoadingSearch(false);
      return;
    }
    setSearchResult([]);
    setIsLoadingSearch(true);

    GlobalApi.searchGames(searchQuery).then((resp) => {
      const filtered = resp.data.results.filter(
        (game) =>
          !/wallpaper|fan.?made|mod|soundtrack|demo|pack|episode|utilities|software|tool|chapter|dlc|prologue|trial/i.test(
            game.name
          )
      );
      setSearchResult(filtered);
      setIsLoadingSearch(false);
    });
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: game, isLoading: isLoadingGame } = useQuery({
    queryKey: ["gameDetails", gameId],
    queryFn: () =>
      gameId ? GlobalApi.getGameDetails(gameId).then((res) => res.data) : null,
    enabled: !!gameId,
    staleTime: 1000 * 60 * 5,
  });

  if (searchQuery) {
    return isLoadingSearch ? (
      <div className="flex items-center justify-center h-40">
        <div className="loader"></div>
      </div>
    ) : (
      <GamesByGenreId
        key={searchQuery}
        gameList={searchResult}
        selectedGenresName="Search"
        enableInfiniteScroll={false}
        genreId="search"
        setSearchQuery={setSearchQuery}
      />
    );
  }

  if (isLoadingGame)
    return (
      <div className="flex items-center justify-center h-40">
        <div className="loader"></div>
      </div>
    );

  if (!game)
    return (
      <div className="press text-3xl text-center m-auto bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 dark:from-cyan-400 dark:via-fuchsia-500 dark:to-purple-600 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient flicker fixed inset-2/4 h-fit w-3xs">
        Game not found.
      </div>
    );

  const visibleTagCount = showAllTags ? game.tags.length : isMd ? 5 : 2;
  const visibleTags = game.tags?.slice(0, visibleTagCount) || [];
  const hiddenCount = game.tags?.length - visibleTagCount || 0;

  return (
    <div className="pb-5 mx-auto space-y-6 md:px-4 lg:px-8">
      {/* Game Title */}
      <h1 className="mb-4 text-3xl font-bold monoton bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 dark:from-cyan-400 dark:via-fuchsia-500 dark:to-purple-600 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient font-cy animate-neon flicker">
        {game.name}
      </h1>

      {/* Background Image */}
      {game.background_image && (
        <div
          className="relative w-full rounded-lg p-1 bg-gradient-to-r from-purple-800 via-blue-500 to-pink-600
                  bg-[length:300%_300%] animate-gradient animate-neon-glow
                  dark:from-purple-700 dark:via-fuchsia-500 dark:to-cyan-400 dark:bg-[length:400%_400%]"
        >
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Description */}
      <p className="text-sm leading-relaxed text-gray-800 share-tech-mono sm:text-base md:text-lg dark:text-gray-300">
        {game.description_raw}
      </p>

      {/* Developers */}
      {game.developers?.length > 0 && (
        <div className="text-sm sm:text-base md:text-lg text-cyan-400 audiowide">
          <strong>Developers:</strong>{" "}
          {game.developers.map((dev) => dev.name).join(", ")}
        </div>
      )}

      {/* Publishers */}
      {game.publishers?.length > 0 && (
        <div className="text-sm text-purple-400 sm:text-base md:text-lg audiowide">
          <strong>Publishers:</strong>{" "}
          {game.publishers.map((pub) => pub.name).join(", ")}
        </div>
      )}

      {/* Tags */}
      {game.tags?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-pink-600 sm:text-base md:text-lg monoton dark:text-pink-400">
          <strong>Tags:</strong>{" "}
          {visibleTags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 transition rounded-md cursor-default bg-pink-100/50 dark:bg-gray-800/50 hover:bg-pink-200/70 dark:hover:bg-gray-800/80
                   hover:drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.7)]"
            >
              {tag.name}
            </span>
          ))}
          {/* Show remaining button */}
          {hiddenCount > 0 && !showAllTags && (
            <button
              onClick={() => setShowAllTags(true)}
              className="px-2 py-1 transition rounded-md cursor-pointer bg-pink-100/50 dark:bg-gray-800/50 hover:bg-pink-200/70 dark:hover:bg-gray-800/80
                   hover:drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.7)]"
            >
              +{hiddenCount} more
            </button>
          )}
          {/* Futuristic Hide button */}
          {showAllTags && (
            <button
              onClick={() => setShowAllTags(false)}
              className="flex items-center justify-center w-8 h-8 px-2 py-1 text-sm transition border border-pink-500 dark:border-pink-400 rounded-full cursor-pointer bg-pink-100/70 dark:bg-gray-900/70
                   hover:bg-pink-400/30 hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(255,20,147,0.7)]"
              title="Collapse tags"
            >
              <span className="text-lg font-bold text-pink-500 dark:text-pink-400">
                ⟲
              </span>
            </button>
          )}
        </div>
      )}

      {/* Stores */}
      {game.stores?.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 text-sm text-green-400 sm:text-base md:text-lg audiowide dark:text-green-300">
          <strong>Available on:</strong>{" "}
          {game.stores.map((storeObj) => {
            const storeUrls = {
              steam: "https://store.steampowered.com/",
              "epic-games": "https://www.epicgames.com/store/",
              gog: "https://www.gog.com/",
              "playstation-store": "https://store.playstation.com/",
              "xbox-store": "https://www.xbox.com/microsoft-store",
              xbox360: "https://www.xbox.com/microsoft-store",
              nintendo: "https://www.nintendo.com/store/",
              "apple-appstore": "https://www.apple.com/app-store/",
              "google-play": "https://play.google.com/",
              itch: "https://itch.io/",
            };

            const storeUrl =
              storeObj.url || storeUrls[storeObj.store.slug] || "#";

            return (
              <a
                key={storeObj.store.id}
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 transition border border-green-400 rounded-md hover:bg-green-400/20 
                     hover:drop-shadow-[0_0_6px_rgba(0,255,128,0.7)] dark:hover:drop-shadow-[0_0_6px_rgba(0,255,128,0.9)]"
              >
                {storeObj.store.name}
              </a>
            );
          })}
        </div>
      )}

      {/* Buy Now Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setShowBuyNowModal(true)}
          className="relative px-6 py-3 text-lg font-bold text-white bg-pink-500 rounded-lg transition-all duration-300 hover:bg-pink-600 hover:drop-shadow-[0_0_10px_rgba(255,0,255,0.7)] dark:hover:drop-shadow-[0_0_10px_rgba(255,20,147,0.8)] overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-full before:content-[''] before:opacity-70 before:mix-blend-screen after:absolute after:top-0 after:left-0 after:w-full after:h-full after:content-[''] after:opacity-70 after:mix-blend-screen hover:before:animate-[glitch-top_0.3s_infinite_linear_alternate-reverse] hover:after:animate-[glitch-bottom_0.3s_infinite_linear_alternate-reverse] buy-btn"
        >
          Buy Now
        </button>
      </div>

      {/* Buy Now Modal */}
      {showBuyNowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="flex flex-col gap-0 items-start relative w-11/12 max-w-lg p-6 bg-gray-900 border-2 border-pink-500 rounded-lg animate-neon-glow">
            <h2 className="mb-4 text-2xl font-bold text-pink-500 flicker">
              Confirm Purchase
            </h2>
            <p className="mb-4 text-sm text-gray-300 cursor-default">
              <span className="inline">
                You are about to buy <strong>{game.name}</strong> for{" "}
                <strong>₹3500</strong>.
              </span>
            </p>

            {/* Terms Checkbox */}
            <label className="flex items-center gap-2 mb-4 text-gray-300">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="accent-pink-500"
              />
              I accept the{" "}
              <span
                className="underline decoration-2 decoration-dotted underline-offset-2 cursor-pointer relative"
                onClick={() => setShowPopover((prev) => !prev)}
                ref={popoverRef} // attach ref here
              >
                <strong>terms and conditions</strong>
                {/* Popover */}
                {showPopover && (
                  <div className="absolute z-10 mt-2 w-fit p-2.5 text-sm text-white bg-gray-800 rounded-lg shadow-lg">
                    You will not get any game key!
                  </div>
                )}
              </span>
            </label>

            <div className="flex self-stretch justify-between gap-4">
              {/* Cancel */}
              <button
                onClick={() => setShowBuyNowModal(false)}
                className="px-4 py-2 font-bold text-gray-200 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              {/* UPI Button */}
              <a
                href="upi://pay?pa=7006144120@ptyes&pn=YourName&am=3500&cu=INR"
                onClick={(e) => {
                  if (!acceptedTerms) {
                    e.preventDefault();
                    alert("You must accept the terms and conditions first.");
                  } else if (!/Android|iPhone/i.test(navigator.userAgent)) {
                    e.preventDefault();
                    alert(
                      "UPI payments only work on mobile devices with UPI apps installed."
                    );
                  }
                }}
                className="px-4 py-2 font-bold text-white rounded bg-green-500 hover:bg-green-600
             hover:drop-shadow-[0_0_8px_rgba(0,255,128,0.8)]"
              >
                Pay with UPI
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
