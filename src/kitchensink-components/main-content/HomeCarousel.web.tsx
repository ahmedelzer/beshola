import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import AddCard from "../../components/cards/AddMediaCard";
import "swiper/swiper-bundle.css";
import "./slider.css";
import { View } from "react-native";

const data = [
  { src: require("../../../assets/display/ad1.png") },
  { src: require("../../../assets/display/ad2.png") },
  { src: require("../../../assets/display/ad3.png") },
  { src: require("../../../assets/display/ad4.png") },
  {
    src: require("../../../assets/display/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg"),
  },
];

const HomeCarouselWeb = () => {
  return (
    <div className="w-full bg-gray-100 py-4">
      <div className="mx-auto max-w-[1440px]">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            200: {
              slidesPerView: 1,
              spaceBetween: 30,
              slidesPerGroup: 1,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 30,
              slidesPerGroup: 1,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 30,
              slidesPerGroup: 2,
            },
            1440: {
              slidesPerView: 3,
              spaceBetween: 30,
              slidesPerGroup: 3, // ✅ fixes pagination bullets
            },
          }}
          loop={true}
          pagination={{ clickable: true, type: "bullets" }}
          className="rounded-2xl overflow-hidden shadow-md"
        >
          {data.map((item, i) => (
            <SwiperSlide key={i}>
              <View
                key={i}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
              >
                <AddCard
                  source={item.src}
                  customStyle={{
                    backgroundSize: "100% 100%",
                  }}
                />
              </View>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCarouselWeb;
