import React, { useEffect } from "react";

const TrendingGames = ({ gameList }) => {
  useEffect(() => {});
  return (
    <div className="hidden md:flex flex-col mt-5">
      <h2 className="font-bold text-3xl dark:text-white">Trending Games</h2>

      <div className="md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gameList.map(
          (item, index) =>
            index < 4 && (
              <div
                key={item.id}
                className="bg-[#76a8f75e] rounded-lg group hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer mt-5"
              >
                <img
                  src={item.background_image}
                  alt={item.name}
                  className="h-[270px] rounded-t-lg object-cover "
                />
                <h2 className="dark:text-white p-2 text-xl font-bold">
                  {item.name}
                </h2>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default TrendingGames;
