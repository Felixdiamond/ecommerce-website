import CustomBtn, { ButtonStyle } from "@/components/Button";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { styled } from "styled-components";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import StyledTable from "@/components/Table";
import Input from "@/components/Input";
import Notify, { notify } from "@/components/Notification";
import { logoutUser } from "@/lib/supabase";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  margin-top: 40px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const Box = styled.div`
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const Boxx = styled.div`
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
  padding-bottom: 50px;
  max-height: 15rem;
  margin-bottom: 2rem;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 100px;
  height: 100px;
  padding: 2px;
  // box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 5px 15px;
  display: block;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
    display: inline-block;
    padding: 0 10px;
  }
`;

const StyledData = styled.td`
  padding-top: 2rem;
`;

const QuantityTd = styled.td`
  @media screen and (max-width: 767px) {
    align-items: center;
    justify-content: center;
  }
`;

const ProductImage = styled.img`
  max-width: 100%;
`;

export default function CartPage({ user }) {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhoneNumber(user?.phoneNumber || "");
  }, [user]);

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post("/api/cart", { ids: cartProducts }).then((response) => {
        setProducts(response.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, [clearCart]);

  function quantityIncrease(id) {
    addProduct(id);
  }

  function quantityDecrease(id) {
    removeProduct(id);
  }

  function findFile(files, extension) {
    return files.find(file => file.endsWith(extension));
  }
  

  async function initiatePayment() {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !phoneNumber) {
      notify("Please fill all fields", "error");
      return;
    } else if (!emailRegex.test(email)) {
      notify("Invalid email format", "error");
      setEmail("");
      return;
    }
    console.log(findFile(products[0].images))

    const response = await axios.post("/api/checkout", {
      name,
      email,
      phoneNumber,
      products: products.map((item) => {
        const pdfFile = findFile(item.images, '.pdf');
        const mp4File = findFile(item.images, '.mp4');
        const audioFile = findFile(item.images, '.mp3');
        return {
          id: item._id,
          name: item.title,
          image: item.images[0],
          pdf: pdfFile,
          video: mp4File,
          audio: audioFile,
          orderId: "",
        };
      }),
      userId: user._id,
      amount: 100 * total,
    });

    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let total = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id === productId)?.discountPrice || 0;
    total += price;
  }

  if (isSuccess) {
    setTimeout(() => {
      logoutUser();
    }, 7000);
    return (
      <>
        <Header user={user} />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h2>Thanks for your Order &nbsp; (✿◡‿◡)</h2>
              <div>
                Your order has been placed successfully. You will be logged out to complete purchase shortly.
              </div>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
    
  }

  return (
    <>
      <Header user={user} />
      <Notify />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {!cartProducts?.length && (
              <div>Your cart is empty &nbsp; (˘･_･˘)</div>
            )}
            {products?.length > 0 && (
              <StyledTable>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.title}>
                      <ProductInfoCell>
                        <ProductImageBox>
                          <ProductImage src={product.images[0]} alt={product.title} />
                        </ProductImageBox>
                        {product.title}
                      </ProductInfoCell>
                      <QuantityTd>
                        <CustomBtn
                          onClick={() => quantityDecrease(product._id)}
                        >
                          -
                        </CustomBtn>
                        <QuantityLabel>
                          {
                            cartProducts.filter((id) => id === product._id)
                              .length
                          }
                        </QuantityLabel>

                        <CustomBtn
                          onClick={() => quantityIncrease(product._id)}
                        >
                          +
                        </CustomBtn>
                      </QuantityTd>
                      <td>
                        ₦
                        {cartProducts.filter((id) => id === product._id)
                          .length * product.discountPrice}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <StyledData>Total</StyledData>
                    <StyledData></StyledData>
                    <StyledData>₦{total}</StyledData>
                  </tr>
                </tbody>
              </StyledTable>
            )}
          </Box>
          {!!cartProducts?.length && (
            <Boxx>
              <h2>Order Information</h2>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(ev) => setEmail(ev.target.value)}
              />

              <Input
                type="text"
                placeholder="Phone Number"
                value={phoneNumber}
                name="phoneNumber"
                onChange={(ev) => {
                  const value = ev.target.value;
                  if (!isNaN(value)) {
                    setPhoneNumber(value);
                  }
                }}
              />

              <CustomBtn block={1} black={1} cart={1} onClick={initiatePayment}>
                Continue to checkout
              </CustomBtn>
            </Boxx>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}
