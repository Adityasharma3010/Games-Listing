import React, { useEffect } from "react";

const Banner = ({ gameBanner }) => {
  useEffect(() => {}, []);
  return (
    <div className="relative">
      <div className="absolute bottom-0 p-5 bg-gradient-to-t from-slate-900 to-transparent rounded-b-xl w-full">
        <h2 className="text-2xl text-white font-bold">{gameBanner.name}</h2>
        <button className="bg-blue-700 text-white px-2 py-1 rounded-lg">
          Get Now
        </button>
      </div>
      <img
        src={gameBanner.background_image}
        alt={gameBanner.name}
        className="md:h-[320px] w-full object-cover object-top rounded-xl"
      />
    </div>
  );
};

export default Banner;
