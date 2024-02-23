import { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { primary } from "@/lib/colors";
import axios from "axios";
import Notify, { notify } from "./Notification";

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
`;

const colorChange = keyframes`
  0% {
    fill: black;
  }
  50% {
    fill: ${primary};
  }
  100% {
    fill: #ed2939;
  }
`;

const thump = keyframes`
  0% {transform: scale(1);}
  25% {transform: scale(1.1); }
  50% {transform: scale(1);}
  75% {transform: scale(1.1);}	
  100% {transform: scale(1);}
`;

const StyledSvg = styled.svg`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 39;
  padding: 5px;
  width: 1.4rem;
  height: 1.4rem;
  ${({ liked }) => {
    if (liked) {
      return css`
        animation: ${pulse} 0.5s ease-in-out, ${colorChange} 0.5s linear,
          ${thump} 0.5s cubic-bezier(0.28, 0.13, 0.7, 1.02);
      `;
    }
  }}
`;

export default function Heartify({ productId, userId, userFavs }) {
  const [liked, setLiked] = useState(userFavs?.includes(productId));

  useEffect(() => {
    setLiked(userFavs?.includes(productId));
  }, [userId, productId, userFavs]);

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      setLiked(!liked);
      await axios.post("/api/favorites", { productId, userId }).then((res) => {
        if (liked) {
          notify("Item removed from favorites");
        } else {
          notify("Item added to favorites");
        }
      });
    } catch (err) {
      console.error(err);
      notify("Error updating favorites", "error");
      setLiked(false);
    }
  };

  return (
    <>
      <Notify />
      {liked ? (
        <StyledSvg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#ed2939"
          className="w-2 h-2"
          onClick={handleLike}
          liked={liked}
        >
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </StyledSvg>
      ) : (
        <StyledSvg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-2 h-2"
          onClick={handleLike}
          liked={liked}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </StyledSvg>
      )}
    </>
  );
}
