import { CartContextProvider } from "@/components/CartContext";
import React from "react";
import { createGlobalStyle } from "styled-components";
import useUser from "@/lib/checkUser";

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #eee;
    padding: 0;
    margin: 0;
    font-family: 'Gabarito', cursive;
  }
`;

export default function App({ Component, pageProps }) {
  const user = useUser();
  const MemoizedComponent = React.memo(Component);

  return (
    <>
      <GlobalStyles />
      <CartContextProvider>
        <MemoizedComponent {...pageProps} user={user} />
      </CartContextProvider>
    </>
  );
}