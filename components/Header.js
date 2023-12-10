import Link from "next/link";
import { styled } from "styled-components";
import Center from "./Center";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";
import supabase from "@/lib/connSupa";
import axios from "axios";

const StyledHeader = styled.header`
  background-color: #222;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  position: relative;
  z-index: 41;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const NavLink = styled(Link)`
  display: block;
  color: #aaa;
  text-decoration: none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledNav = styled.nav`
  ${(props) =>
    props.mobileNavActive
      ? `
    display: block
  `
      : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  z-index: 40;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border: 0;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 41;
  @media screen and (min-width: 768px) {
    display: none;
  }
`;

const StyledSvg = styled.svg`
  width: 25px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const UserText = styled.span`
  display: flex;
  color: white;
  padding: 0 10px;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;


export default function Header() {
  const { cartProducts } = useContext(CartContext);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState({});
  const [calledAlready, setCalledAlready] = useState(false);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await supabase.auth.getSession();
      setSession(session);
    };

    fetchSession();
  }, []);

  if (
    session &&
    !calledAlready &&
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

  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={"/"}>nineBooks</Logo>
          <StyledNav mobileNavActive={mobileNavActive}>
            <NavLink href={"/"}>Home</NavLink>
            <NavLink href={"/products"}>All Products</NavLink>
            <NavLink href={"/categories"}>Categories</NavLink>
            <NavLink href={"/cart"}>Cart ({cartProducts.length})</NavLink>
            {mobileNavActive && (
              <NavLink href={"/account"}>
                  Account ({user && user.name ? user.name.split(" ")[0] : "Guest"})
              </NavLink>
            )}
          </StyledNav>
          <NavLink href={"/account"}>
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
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </StyledSvg>
            <UserText>
              {user && user.name ? user.name.split(" ")[0] : "Guest"}
            </UserText>
          </NavLink>

          <NavButton onClick={() => setMobileNavActive((prev) => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}
