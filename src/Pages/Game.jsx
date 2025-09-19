import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import GlobalApi from "../Services/GlobalApi";

const Game = () => {
  const { id } = useParams();
  const { data: game, isLoading } = useQuery({
    queryKey: ["gameDetails", id],
    queryFn: () => GlobalApi.getGameDetails(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-40">
        <div className="loader"></div>
        <style>{`
          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  if (!game) return <div>Game not found.</div>;

  return (
    <div className="max-w-3xl p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold dark:text-white">{game.name}</h1>
      <img
        src={game.background_image}
        alt={game.name}
        className="w-full mb-4 rounded-lg"
      />
      <p className="dark:text-white">{game.description_raw}</p>
      {/* Add more game details as needed */}
    </div>
  );
};

export default Game;
