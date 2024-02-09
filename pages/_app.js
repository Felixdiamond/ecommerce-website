import { CartContextProvider } from "@/components/CartContext";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [fetchOnce, setFetchOnce] = useState(false);

  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
    const ciphertext = Cookies.get("user");
    if (!ciphertext && !isNavigating) {
      setIsNavigating(true);
      if (!fetchOnce) {
        router.push("/login").then(() => setIsNavigating(false));
        setFetchOnce(true);
      }
      return;
    }
    if (ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setUser(decryptedUser);
    }
  }, [router, router.pathname, user, isNavigating, fetchOnce]);
  return (
    <>
      <GlobalStyles />
      <CartContextProvider>
        <Component {...pageProps} user={user} />
      </CartContextProvider>
    </>
  );
}
