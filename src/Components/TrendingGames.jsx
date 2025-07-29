import React, { useEffect } from "react";

const TrendingGames = ({ gameList }) => {
  useEffect(() => {});

  return (
    <div className="hidden md:flex flex-col">
      {gameList.length === 0 ? (
        <div className="flex justify-center items-center h-20">
          <div className="loader"></div>
        </div>
      ) : (
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

export default TrendingGames;
