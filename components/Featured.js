import React, { useEffect, useLayoutEffect, useContext, forwardRef, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
// import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/swiper-bundle.css";

// import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import styled from "styled-components";

const StyledDiv = styled.div``;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 50vh;
  top: 0;
  left: 0;
  padding: 0;
  margin: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-top: -12vh;
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
  }

  .swiper-pagination-bullet {
    background: white;
  }
`;

const Title = styled.h1`
  position: absolute;
  color: white;
  font-size: 2rem;
  margin: 0;
  padding: 0;
  margin-top: 1rem;
  z-index: 1000; // Increase the z-index
`;

const Description = styled.p`
  position: absolute;
  color: white;
  font-size: 1rem;
  margin: 0;
  padding: 0;
  margin-top: 1rem;
  z-index: 1000; // Increase the z-index
`;


export default function App() {
  return (
    <>
      <StyledDiv>
        <StyledSwiper
          // navigation={true}
          effect={"fade"}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            {/* <StyledImage src="https://ik.imagekit.io/choppa123/wallpaperflare.com_wallpaper%20(3).jpg?updatedAt=1702324771519" /> */}
            <StyledImage src="https://ik.imagekit.io/choppa123/Brown%20Black%20Hello%20May%20Flyer_20230924_115623_0000.jpeg.jpg?updatedAt=1702535864292" />
          </SwiperSlide>
          <SwiperSlide>
            {/* <StyledImage src="https://ik.imagekit.io/choppa123/wallpaperflare.com_wallpaper%20(5).jpg?updatedAt=1702324842689" /> */}
            <StyledImage src="https://ik.imagekit.io/choppa123/Bullet%20journal%20note%20book%20cover_20230924_120938_0000.jpeg.jpg?updatedAt=1702535864140" />
          </SwiperSlide>
          <SwiperSlide>
            {/* <StyledImage src="https://ik.imagekit.io/choppa123/wp11601055-the-eminence-in-shadow-wallpapers.jpg?updatedAt=1702324843161" /> */}
            <StyledImage src="https://ik.imagekit.io/choppa123/Bullet%20journal%20note%20book%20cover_20230924_122248_0000.jpeg.jpg?updatedAt=1702535864136" />
          </SwiperSlide>
          <SwiperSlide>
            <StyledImage src="https://ik.imagekit.io/choppa123/WhatsApp%20Image%202023-12-12%20at%2007.24.44_36660efb.jpg?updatedAt=1702536060042" />
          </SwiperSlide>
        </StyledSwiper>
      </StyledDiv>
    </>
  );
}
