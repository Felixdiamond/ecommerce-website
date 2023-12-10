import { styled } from "styled-components";
import Center from "./Center";
import Image from "next/image";
import CustomBtn from "./Button";
import ButtonLink from "./ButtonLink";
import CartIcon from "./icons/CartIcon";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import Notify, { notify } from "./Notification";

const Bg = styled.div`
  background-color: #222;
  color: #fff;
  padding: 50px 0;
`;

const Title = styled.h1`
  margin: 0;
  font-weight: normal;
  font-size: 2rem;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 2.5rem;
    text-align: left;
  }
`;

const Desc = styled.p`
  color: #aaa;
  font-size: 0.8rem;
  text-align: center;
  @media screen and (min-width: 768px) {
    text-align: left;
  }
`;

const ColumnsWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  gap: 10vw;
  img {
    max-width: 100%;
    max-height: 200px;
    display: block;
    margin: 0 auto;
  }
  div:nth-child(1) {
    order: 2;
  }
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.9fr 1.1fr;
    div:nth-child(1) {
      order: 0;
    }
    img {
      max-width: 80%;
      max-height: auto;
    }
  }
`;

const StyledImage = styled.img`
  max-width: 70%;
`;

const Column = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1.2vw;
  margin-top: 1rem;
  @media screen and (max-width: 767px) {
    align-items: center;
    justify-content: center;
    gap: 5vw;
  }
`;

export default function Featured({ product }) {
  const { addProduct } = useContext(CartContext);
  function addFeaturedToCart() {
    addProduct(product._id);
    notify("Item added to cart", "success")
  }
  return (
    <Bg>
      <Notify />
      <Center>
        <ColumnsWrapper>
          <Column>
            <div>
              <Title>{product.title}</Title>
              <Desc>{product.description}</Desc>
              <ButtonWrapper>
                <ButtonLink
                  white={1}
                  outline={1}
                  size={"l"}
                  href={`/product/${product._id}`}
                >
                  Read more
                </ButtonLink>
                <CustomBtn white={1} size={"l"} onClick={addFeaturedToCart}>
                  <CartIcon className="w-2 h-2" />
                  Add to cart
                </CustomBtn>
              </ButtonWrapper>
            </div>
          </Column>
          <Column>
            <StyledImage
              src="https://ik.imagekit.io/choppa123/same_Q6iMEO05v?updatedAt=1698525827368"
              alt=""
            />
          </Column>
        </ColumnsWrapper>
      </Center>
    </Bg>
  );
}
