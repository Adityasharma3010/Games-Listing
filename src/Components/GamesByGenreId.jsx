import React, { useEffect } from "react";

const GamesByGenreId = ({ gameList, selectedGenresName }) => {
  useEffect(() => {
    console.log("Game List:", gameList);
  });

  return (
    <div className="">
      <h2 className="font-bold text-3xl dark:text-white mt-5">
        {selectedGenresName} Games
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {gameList?.map((item) => (
          <div className="bg-[#76a8f75e] p-3 rounded-lg hover:scale-110 transition-all duration-300 cursor-pointer">
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
              ⭐{item.rating} 💭{item.ratings_count} 🔥{item.suggestions_count}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesByGenreId;
