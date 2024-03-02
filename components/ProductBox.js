import styled, { keyframes } from "styled-components";
import Button from "./Button";
import Link from "next/link";
import { useContext, useState,useEffect } from "react";
import { CartContext } from "./CartContext";
import Heartify from "./Heartify";
import Notify, { notify } from "@/components/Notification";
import supabase from "@/lib/connSupa";
import axios from "axios";

const DiscountLabel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fef3e9;
  color: #f79939;
  padding: 3px;
  margin-left: 6px;
  margin-top: 6px;
  font-size: 0.8rem;
  border-radius: 2px;
`;

const ProductWrapper = styled.div`
`;

const Linkk = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

const WhiteBox = styled.div`
  position: relative;
  background-color: ${(props) => props.myColor};
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
  :hover {
    cursor: pointer;
  }
`;

const Title = styled(Linkk)`
  font-weight: 600;
  font-size: 0.8rem;
  margin: 0;
`;

const ProductInfoBox = styled.div`
  margin-top: 10px;
`;

const PriceRow = styled.div`
  display: block;
  align-items: center;

  justify-content: space-between;
  margin-top: 5px;
  @media screen and (min-width: 768px) {
    display: flex;
  }
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: bold;
  text-align: right;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const OldPrice = styled.div`
  font-size: 0.75rem;
  color: #999;
  text-decoration: line-through;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const PriceDiv = styled.div`
  @media screen and (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
  }
`;
const BoxedImg = styled.img`
  max-width: 100%;
  max-height: auto;
  border-radius: 10px;
`;

export default function ProductBox({
  _id,
  title,
  discountPrice,
  price,
  images,
  user,
  userFavs,
  color
}) {
  const { addProduct } = useContext(CartContext);
  const [isMobile, setIsMobile] = useState(false);
  const uri = `/product/${_id}`;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <ProductWrapper>
      <Notify />
      <WhiteBox onClick={() => {
        window.location.href = uri;
      }} myColor={color}>
        <DiscountLabel>
          -{(((price - discountPrice) / price) * 100).toFixed(0)}%
        </DiscountLabel>
        <Heartify productId={_id} userId={user?._id} userFavs={userFavs} />
          <BoxedImg src={images?.[0]} alt="" />
      </WhiteBox>
      <ProductInfoBox>
        <Title href={uri}>{title}</Title>
        <PriceRow>
          <PriceDiv>
            <OldPrice>&#8358;{price}</OldPrice>
            <Price>&#8358;{discountPrice}</Price>
          </PriceDiv>
          <Button
            onClick={() => {
              addProduct(_id);
              notify("Item added to cart", "success");
            }}
            primary={1}
            outline={1}
            smaller={1}
            block={isMobile ? 1 : 0}
          >
            Add to cart
          </Button>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}

