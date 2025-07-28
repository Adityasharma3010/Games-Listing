import React, { useEffect, useRef, useCallback, useState } from "react";
import GlobalApi from "../Services/GlobalApi";

const GamesByGenreId = ({
  selectedGenresName,
  gameList: initialGameList,
  genreId,
}) => {
  const [gameList, setGameList] = useState(initialGameList || []);
  const [page, setPage] = useState(2); // Start from 2 since initial list is page 1
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    setGameList(initialGameList || []);
    setPage(2);
    setHasMore(true);
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

  const loadMoreGames = () => {
    setLoading(true);
    GlobalApi.getGameListByGenreId(genreId, page)
      .then((resp) => {
        const newGames = resp.data.results;
        setGameList((prev) => [...prev, ...newGames]);
        setPage((prev) => prev + 1);
        if (!resp.data.next) setHasMore(false);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="">
      <h2 className="font-bold text-3xl dark:text-white mt-5">
        {selectedGenresName} Games
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {gameList?.map((item, index) => {
          const isLast = index === gameList.length - 1;
          return (
            <div
              key={item.id}
              ref={isLast ? lastGameRef : null}
              className="bg-[#76a8f75e] p-3 rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              <img
                src={item.background_image}
                alt={item.name}
                className="w-full h-[250px] sm:h-[300px] md:h-[170px] rounded-xl object-cover"
              />
              <h3 className="text-xl dark:text-white font-bold">
                {item.name}
                <span className="p-1 rounded-sm ml-2 text-[10px] bg-green-100 text-green-700 font-medium">
                  {item.metacritic}
                </span>
              </h3>
              <h3 className="text-gray-500 dark:text-gray-300">
                ⭐{item.rating} 💭{item.ratings_count} 🔥
                {item.suggestions_count}
              </h3>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center items-center mt-6">
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
