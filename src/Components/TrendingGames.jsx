import React from "react";
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
  const renderCard = (item) => (
    <div
      key={item.id}
      className="bg-[#76a8f75e] rounded-lg group hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer mt-5 w-full"
    >
      <img
        src={item.background_image}
        alt={item.name}
        className="h-[270px] rounded-t-lg object-cover w-full"
      />
      <h2 className="dark:text-white p-2 text-xl font-bold truncate">
        {item.name}
      </h2>
    </div>
  );

  return (
    <div className="flex flex-col -mx-4 sm:-ml-1 lg:mx-0">
      {gameList.length === 0 ? (
        <div className="flex justify-center items-center h-20">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {/* Mobile/Tablet: Swiper */}
          <div className="flex lg:hidden w-full md:-ml-4 md:-mr-4">
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
              {gameList.slice(0, 10).map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="w-full pb-4 px-4">{renderCard(item)}</div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop (lg+): Grid */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-5">
            {gameList.slice(0, 4).map(renderCard)}
          </div>
        </>
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
