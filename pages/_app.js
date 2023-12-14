import { CartContextProvider } from "@/components/CartContext";
import { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router';

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

  useEffect(() => {
    const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
    const ciphertext = Cookies.get('user');
    if (!ciphertext) {
      router.push('/login');
      return;
    };
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    setUser(decryptedUser);
  }, [router]);

  return (
    <>
      <GlobalStyles />
        <CartContextProvider>
          <Component {...pageProps} user={user} />
        </CartContextProvider>
    </>
  );
}
