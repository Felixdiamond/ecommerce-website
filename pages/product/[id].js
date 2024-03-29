import CustomBtn from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductImages from "@/components/ProductImages";
import Title from "@/components/Title";
import WhiteBox from "@/components/WhiteBox";
import CartIcon from "@/components/icons/CartIcon";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { useContext } from "react";
import { Category } from "@/models/Category";
import styled from "styled-components";
import Notify, { notify } from "@/components/Notification";

const ColWrapper = styled.div`
  display: grid;
  /* grid-template-columns: auto.6fr auto.4fr; */
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const PriceRow = styled.div`
  display: block;
  gap: 20px;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.8rem;
  font-weight: bold;
`;

const PropertiesDiv = styled.div``;

const Property = styled.p``;

const DaBox = styled.div`
  max-height: 12rem;
`;

const InnerPriceRow = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: left;
  text-align: left;
`;

const OldPrice = styled.div`
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
`;

const SavingsInfo = styled.p`
  color: #55c7a1;
  font-size: 0.75rem;
  font-weight: bold;
`;

const BlackDivider = styled.hr`
  border: transparent;
  width: 25%;
  margin: 1rem auto;
`;

const Daboxx = styled.div`
  @media screen and (max-width: 767px) {
    margin-top: 60vh;
    margin-bottom: 6vh;
  }
`;

const YahariWhiteBox = styled.div`
  @media screen and (max-width: 767px) {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
  }
`;

export default function ProductPage({ product }) {
  const { addProduct } = useContext(CartContext);
  return (
    <>
      <Notify />
      <Header />
      <Center>
        <ColWrapper>
          <DaBox>
            <WhiteBox>
              <ProductImages images={product.images} />
            </WhiteBox>
          </DaBox>
          <Daboxx>
            <YahariWhiteBox>
              <Title>{product.title}</Title>
              <p>{product.description}</p>
              {product.category.properties.length > 0 && (
                <PropertiesDiv>
                  <h2>Properties</h2>
                  <div>
                    {product.category.properties.map((property) => (
                      <Property key={property.name}>
                        {property.name}: {property.values[0]}
                      </Property>
                    ))}
                  </div>
                </PropertiesDiv>
              )}

              <PriceRow>
                <BlackDivider />
                <InnerPriceRow>
                  <Price>&#8358;{product.discountPrice}</Price>
                  <OldPrice>&#8358;{product.price}</OldPrice>
                  <SavingsInfo>
                    You save &#8358;{product.price - product.discountPrice}
                  </SavingsInfo>
                </InnerPriceRow>
                <BlackDivider />
                <div>
                  <CustomBtn
                    primary={1}
                    block={1}
                    onClick={() => {
                      addProduct(product._id);
                      notify("Added to cart", "success");
                    }}
                  >
                    <CartIcon />
                    Add to cart
                  </CustomBtn>
                </div>
              </PriceRow>
            </YahariWhiteBox>
          </Daboxx>
        </ColWrapper>
      </Center>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id).populate("category");
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}
