import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import styled from "styled-components";
import { logoutUser } from "@/lib/supabase";
import supabase from "@/lib/connSupa";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const BoxedImg = styled.img`
  max-width: 100%;
  max-height: auto;
  border-radius: 10px;
`;

export default function AccountsPage() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState({});
  const [calledAlready, setCalledAlready] = useState(false);
  const [myColor, setMyColor] = useState("rgb(0, 0, 0)");
  const [calledOnce, setCalledOnce] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  if (
    session &&
    calledAlready == false &&
    session.data &&
    session.data.session &&
    session.data.session.user
  ) {
    console.log(session.data.session.user.id);
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (
        session &&
        session.data &&
        session.data.session &&
        session.data.session.user
      ) {
        try {
          await axios
            .post("/api/findByEmail", {
              email: session.data.session.user.email,
            })
            .then((res) => {
              setUser(res.data.data);
            })
            .catch((error) => {
              console.error("Error in axios.post:", error);
            });
        } catch (error) {
          console.error(error);
        }
      }
      setCalledAlready(true);
    };
    fetchCurrentUser();
  }, [session, calledAlready]);

  useEffect(() => {
    const fetchImgColor = async () => {
      if (user && user.image && calledOnce == false) {
        try {
          await axios
            .post("/api/grabColor", {
              image: user.image,
              primary: "false",
              secondary: "true",
            })
            .then((res) => {
              const rgbArray = res.data.color[1];
              const rgbString = `rgb(${rgbArray.join(", ")})`;
              setMyColor(rgbString);
            })
            .catch((error) => {
              console.error("Error in axios.post:", error);
            });
        } catch (error) {
          console.error(error);
        }
        setCalledOnce(true);
      }
    };
    fetchImgColor();
  }, [user, calledOnce]);

  useEffect(() => {
    const populateFavorites = async () => {
      if (user && user.favorites && user.favorites.length > 0) {
        try {
          await axios
            .post("/api/populateFavorites", {
              userId: user._id,
            })
            .then((res) => {
              setFavorites(res.data.data.favorites);
            })
            .catch((error) => {
              console.error("Error in axios.post:", error);
            });
        } catch (error) {
          console.error(error);
          throw new error();
        }
      }
    };
    populateFavorites();
  }, [user]);

  useEffect(() => {
    const populatePurchaseHistory = async () => {
      if (user && user.purchaseHistory && user.purchaseHistory.length > 0) {
        try {
          await axios
            .post("/api/populatePurchases", {
              userId: user._id,
            })
            .then((res) => {
              setPurchaseHistory(res.data.data);
            })
            .catch((error) => {
              console.error("Error in axios.post:", error);
            });
        } catch (error) {
          console.error(error);
        }
      }
    };
    populatePurchaseHistory();
  }, [user]);

  const renderResource = (pdf, video, productId, orderId) => {
    if (typeof pdf !== "undefined") {
      window.location = `/resource/${orderId}/${productId}?type=pdf`;
    } else if (typeof video !== "undefined") {
      window.location = `/resource/${orderId}/${productId}?type=video`;
    } else {
      console.log("No resource found");
    }
  };

  return (
    <>
      <Header />
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
            {user && user.favorites && user.favorites.length > 0 ? (
              <StyledProductsGrid>
                {favorites.map((fav) => (
                  <>
                    <div>
                      <StyledLink
                        href={{
                          pathname: "/product/[id]",
                          query: { id: fav._id },
                        }}
                      >
                        <WhiteBox key={fav.title}>
                          <p>
                            <div>
                              <BoxedImg src={fav.images[0]} />
                            </div>
                          </p>
                        </WhiteBox>
                      </StyledLink>
                      <StyledText>{fav.title}</StyledText>
                    </div>
                  </>
                ))}
              </StyledProductsGrid>
            ) : (
              <p>No favorites yet</p>
            )}
          </ZaBox>
          <ZaBox>
            <h2>Purchased Books & Videos</h2>
            {user && user.purchaseHistory && user.purchaseHistory.length > 0 ? (
              <StyledProductsGrid>
                {purchaseHistory.map((purchase) => (
                  <>
                    <div>
                      <WhiteBox
                        key={purchase.productId}
                        onClick={() =>
                          renderResource(
                            purchase.pdf,
                            purchase.video,
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
                  </>
                ))}
              </StyledProductsGrid>
            ) : (
              <p>No purchases yet</p>
            )}
          </ZaBox>
        </ProfileWrapper>
      </Center>
    </>
  );
}
