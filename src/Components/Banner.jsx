import { Link } from "react-router-dom";
import React, { useEffect } from "react";

const Banner = ({ gameBanner }) => {
  useEffect(() => {}, []);
  return (
    <Link to={`/game/${gameBanner.id}`}>
      <div className="relative cursor-pointer">
        <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-slate-900 to-transparent rounded-b-xl">
          <h2 className="text-2xl font-bold audiowide text-white">
            {gameBanner.name}
          </h2>
          <button className="px-2 py-1 mt-2 text-white text-sm press bg-blue-700 rounded-lg cursor-pointer">
            Read Now
          </button>
        </div>
        <img
          src={gameBanner.background_image}
          alt={gameBanner.name}
          className="md:h-[320px] w-full object-cover object-top rounded-xl"
        />
      </div>
    </Link>
  );
};

export default Banner;
