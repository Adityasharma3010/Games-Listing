import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const TrendingGames = ({
  gameList,
  swiperRef,
  setIsAtBeginning,
  setIsAtEnd,
}) => {
  const renderCard = (item, idx) => {
    if (!item) {
      // Placeholder card for missing games
      return (
        <div
          key={`placeholder-${idx}`}
          className="bg-gray-200 dark:bg-gray-700 rounded-lg h-full min-h-[270px] flex items-center justify-center opacity-50 mt-5 w-full"
        >
          <span className="text-gray-400 dark:text-gray-500">No Game</span>
        </div>
      );
    }
    return (
      <Link to={`/game/${item.id}`} key={item.id}>
        <div className="bg-[#76a8f75e] rounded-lg group hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer mt-5 w-full">
          <img
            src={item.background_image}
            alt={item.name}
            className="h-[270px] rounded-t-lg object-cover object-top w-full"
          />
          <h2 className="p-2 text-lg font-bold truncate orbitron dark:text-white">
            {item.name}
          </h2>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col -mx-4 sm:-ml-1 lg:mx-0">
      {gameList.length === 0 ? (
        <div className="flex items-center justify-center h-20">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet: Swiper */}
          <div className="flex w-full lg:hidden md:-ml-4 md:-mr-4">
            <Swiper
              modules={[Navigation]}
              spaceBetween={0}
              onSwiper={(swiper) => {
                if (swiperRef && swiper) {
                  swiperRef.current = swiper;
                  if (setIsAtBeginning) setIsAtBeginning(swiper.isBeginning);
                  if (setIsAtEnd) setIsAtEnd(swiper.isEnd);
                }
              }}
              className="w-full"
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                640: {
                  slidesPerView: 2,
                },
              }}
            >
              {gameList.slice(0, 10).map((item, idx) => (
                <SwiperSlide key={item?.id || `placeholder-${idx}`}>
                  <div className="w-full h-full px-4 pb-4">
                    {renderCard(item, idx)}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop (lg+): Grid */}
          <div className="hidden gap-5 lg:grid lg:grid-cols-4">
            {gameList.slice(0, 4).map((item, idx) => renderCard(item, idx))}
          </div>
        </>
      )}
    </div>
  );
};

export default TrendingGames;
