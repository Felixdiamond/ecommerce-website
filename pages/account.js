import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import styled from "styled-components";
import { logoutUser } from "@/lib/supabase";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import useIsMobile from "@/components/useIsMobile";

const ProfileWrapper = styled.div`
  margin-top: 40px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ZaBox = styled.div``;

const ColorBox = styled.div`
  background-color: ${(props) => props.myColor};
  padding: 4rem;
  border-radius: 10px;
`;

const ProfilePicContainer = styled.div`
  width: 8rem;
  height: 8rem;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
`;

const ProfilePic = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Namae = styled.h2`
  text-align: center;
  margin-top: 5rem;
`;

const UserInfos = styled.div`
  margin-top: 2rem;
`;

const UserInfo = styled.p``;

const StyledSvg = styled.svg`
  width: 1.4rem;
  height: 1.4rem;
`;

const FavTit = styled.h2`
  display: flex;
  align-items: center;
`;

const LogoutDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem;
`;

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: transparent;
  outline: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: #6a4863;
  }
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const StyledProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 35px;
  @media screen and (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const WhiteBox = styled.div`
  position: relative;
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  img {
    max-width: 100%;
    max-height: 8rem;
  }
`;

const StyledText = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const StyledSvgLogout = styled.svg`
  width: 1.4rem;
  height: 1.4rem;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const BoxedImg = styled.img`
  max-width: 100%;
  max-height: auto;
  border-radius: 10px;
`;

const SupportP = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  text-decoration: none;
  /* color: blue; */
`;

export default function AccountsPage({ user, favorites, purchaseHistory, myColor }) {
  const isMobile = useIsMobile();

  const renderResource = (pdf, video, audio, productId, orderId) => {
    if (typeof pdf !== "undefined") {
      window.location = `/resource/${orderId}/${productId}?type=pdf`;
    } else if (typeof video !== "undefined") {
      window.location = `/resource/${orderId}/${productId}?type=video`;
    } else if (typeof audio !== "undefined") {
      window.location = `/resource/${orderId}/${productId}?type=audio`;
    } else {
      console.log("No resource found");
    }
  };

  return (
    <>
      <Header user={user} />
      <Center>
        <Title>Account</Title>
        <LogoutDiv>
          {user && user.email ? (
            <>
              <span>
                Logged in as <b>{user.email}</b>
              </span>
              {isMobile ? <br /> : <span> &nbsp;| &nbsp;</span>}
            </>
          ) : (
            <>
              <StyledSvg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </StyledSvg>
              <LogoutBtn onClick={() => (window.location = "/register")}>
                Signup
              </LogoutBtn>
              &nbsp;|&nbsp;
              <StyledSvg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </StyledSvg>
              <LogoutBtn onClick={() => (window.location = "/login")}>
                Login
              </LogoutBtn>
            </>
          )}
          {user && user.email ? (
            <>
              <StyledSvgLogout
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-2 h-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </StyledSvgLogout>
              <LogoutBtn onClick={() => logoutUser()}>Logout</LogoutBtn>
            </>
          ) : (
            ""
          )}
        </LogoutDiv>
        <ProfileWrapper>
          <h1>Profile</h1>
          <ZaBox>
            <ColorBox myColor={myColor}></ColorBox>
            <ProfilePicContainer>
              <ProfilePic
                src={
                  user && user.image
                    ? user.image
                    : "https://ik.imagekit.io/choppa123/HD-wallpaper-black-solid-plain-dark.jpg?updatedAt=1701200605715"
                }
                alt="profile"
              />
            </ProfilePicContainer>
            <Namae>{user && user.name ? user.name : "Guest"}</Namae>
            <UserInfos>
              <h2>User Information</h2>
              <UserInfo>
                Email: {user && user.email ? user.email : "—"}
              </UserInfo>
              <UserInfo>
                Phone Number:{" "}
                {user && user.phoneNumber ? user.phoneNumber : "—"}
              </UserInfo>
              <UserInfo>
                Address: {user && user.address ? user.address : "—"}
              </UserInfo>
            </UserInfos>
          </ZaBox>
        </ProfileWrapper>
        <ProfileWrapper>
          <h1>Library</h1>
          <ZaBox>
            <FavTit>
              Favorites&nbsp;
              <StyledSvg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-2 h-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </StyledSvg>
            </FavTit>
            {user && user.favorites && favorites && favorites.length > 0 ? (
              <StyledProductsGrid>
                {favorites?.map((fav) => (
                    <div key={fav.title}>
                      <StyledLink
                        href={{
                          pathname: "/product/[id]",
                          query: { id: fav._id },
                        }}
                      >
                        <WhiteBox>
                          <p>
                            <div>
                              <BoxedImg src={fav.images[0]} />
                            </div>
                          </p>
                        </WhiteBox>
                      </StyledLink>
                      <StyledText>{fav.title}</StyledText>
                    </div>
                ))}
              </StyledProductsGrid>
            ) : (
              <p>No favorites yet</p>
            )}
          </ZaBox>
          <ZaBox>
            <h2>Purchased Books & Videos</h2>
            {user && user.purchaseHistory && purchaseHistory && purchaseHistory.length > 0 ? (
              <StyledProductsGrid>
                {purchaseHistory?.map((purchase) => (
                    <div key={purchase.productId}>
                      <WhiteBox
                        onClick={() =>
                          renderResource(
                            purchase.pdf,
                            purchase.video,
                            purchase.audio,
                            purchase.productId,
                            purchase.orderId
                          )
                        }
                      >
                        <p>
                          <div>
                            <BoxedImg src={purchase.image} />
                          </div>
                        </p>
                      </WhiteBox>
                      <StyledText>{purchase.name}</StyledText>
                    </div>
                ))}
              </StyledProductsGrid>
            ) : (
              <p>No purchases yet</p>
            )}
          </ZaBox>
        </ProfileWrapper>
        <SupportP>
          <a href="mailto:diamondfelix006@gmail.com">
          Contact Support
          </a>
        </SupportP>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  const ciphertext = context.req.cookies.user;
  if (!ciphertext) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  let favorites = null;
  let purchaseHistory = null;
  let myColor = null;

  try {
    if (user.favorites.length > 0) {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/populateFavorites`, {
        userId: user._id,
      });
      favorites = res.data.data.favorites;
    }

    if (user.purchaseHistory.length > 0) {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/populatePurchases`, {
        userId: user._id,
      });
      purchaseHistory = res.data.data;
    }

    if (user && user.image) {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/grabColor`, {
        image: user.image,
        primary: "false",
        secondary: "true",
      });
      const rgbArray = res.data.color[1];
      const rgbString = `rgb(${rgbArray.join(", ")})`;
      myColor = rgbString;
    }
  } catch (error) {
    console.error(error);
    // Handle or rethrow error
  }

  return {
    props: {
      favorites: favorites,
      purchaseHistory: purchaseHistory,
      myColor: myColor,
    },
  };
}