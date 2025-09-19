import React, { useEffect, useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import GlobalApi from "../Services/GlobalApi";
import steamIcon from "../assets/Stores/steam.svg";
import epicIcon from "../assets/Stores/epicgames.svg";
import gogIcon from "../assets/Stores/gogdotcom.svg";
import playstationIcon from "../assets/Stores/playstation.svg";
import xboxIcon from "../assets/Stores/xbox.svg";
import xbox360Icon from "../assets/Stores/xbox360.svg";
import nintendoIcon from "../assets/Stores/nintendo.svg";
import appStoreIcon from "../assets/Stores/appstore.svg";
import googlePlayStore from "../assets/Stores/googleplay.svg";
import itchDotIo from "../assets/Stores/itchdotio.svg";

const storeIcons = {
  steam: {
    icon: steamIcon,
    url: "https://store.steampowered.com/",
  },
  "epic-games": {
    icon: epicIcon,
    url: "https://www.epicgames.com/store/",
  },
  gog: {
    icon: gogIcon,
    url: "https://www.gog.com/",
  },
  "playstation-store": {
    icon: playstationIcon,
    url: "https://store.playstation.com/",
  },
  "xbox-store": {
    icon: xboxIcon,
    url: "https://www.xbox.com/en-US/games/store",
  },
  xbox360: {
    icon: xbox360Icon,
    url: "https://www.xbox.com/en-US/games/store",
  },
  nintendo: {
    icon: nintendoIcon,
    url: "https://www.nintendo.com/store/",
  },
  "apple-appstore": {
    icon: appStoreIcon,
    url: "https://www.apple.com/app-store/",
  },
  "google-play": {
    icon: googlePlayStore,
    url: "https://play.google.com/",
  },
  itch: {
    icon: itchDotIo,
    url: "https://itch.io/",
  },
};

const GamesByGenreId = ({
  selectedGenresName,
  gameList: initialGameList,
  genreId,
  enableInfiniteScroll = true,
}) => {
  const [gameList, setGameList] = useState(initialGameList || []);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    setGameList(initialGameList || []);
    setPage(2);
    setHasMore(true);
    console.log("Store", storeIcons);
  }, [initialGameList, genreId]);

  const lastGameRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreGames();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMoreGames = async () => {
    setLoading(true);
    try {
      const resp = await GlobalApi.getGameListByGenreId(genreId, page);
      const newGames = await Promise.all(
        resp.data.results.map(async (game) => {
          try {
            const detailResp = await GlobalApi.getGameDetails(game.id);
            return { ...game, stores: detailResp.data.stores };
          } catch (e) {
            return game;
          }
        })
      );
      setGameList((prev) => [...prev, ...newGames]);
      setPage((prev) => prev + 1);
      if (!resp.data.next) setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:grid-cols-3">
        {gameList?.map((item, index) => {
          const isLast = index === gameList.length - 1;
          return (
            <Link
              to={`/game/${item.id}`}
              key={item.id}
              ref={enableInfiniteScroll && isLast ? lastGameRef : null}
              className="bg-[#76a8f75e] p-3 gap-1 flex flex-col rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.background_image}
                alt={item.name}
                className="w-full h-[250px] sm:h-[300px] md:h-[170px] rounded-xl object-cover"
              />
              <div className="flex flex-col justify-between grow">
                <h3 className="text-xl font-bold dark:text-white">
                  {item.name}
                  <span className="p-1 rounded-sm ml-2 text-[10px] bg-green-100 text-green-700 font-medium relative -top-[3px]">
                    {item.metacritic}
                  </span>
                </h3>
                <div className="flex flex-col">
                  <h3 className="text-gray-500 dark:text-gray-300">
                    ⭐{item.rating} 💭{item.ratings_count} 🔥
                    {item.suggestions_count}
                  </h3>

                  {/* ✅ Store Logos */}
                  {item.stores && (
                    <div className="flex gap-2 mt-2">
                      {item.stores.map((store) => {
                        const slug = store.store.slug;
                        const storeData = storeIcons[slug];
                        const excludeDarkInvert = [
                          "nintendo",
                          "xbox360",
                        ].includes(slug);
                        return (
                          storeData && (
                            <a
                              key={store.store.id}
                              href={storeData.url}
                              target="_blank"
                            >
                              <img
                                src={storeData.icon}
                                alt={slug}
                                title={store.store.name}
                                className={`w-6 h-6 hover:scale-125 transition-all ${
                                  excludeDarkInvert
                                    ? ""
                                    : "dark:invert dark:brightness-105"
                                }`}
                              />
                            </a>
                          )
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {enableInfiniteScroll && loading && (
        <div className="flex items-center justify-center mt-6">
          <div className="loader"></div>
        </div>
      )}

      <style>{`
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GamesByGenreId;
