import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const useUser = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fetchOnce, setFetchOnce] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
      const ciphertext = Cookies.get('user');
      if (!ciphertext) router.push('/login');

      // If user is not authenticated, redirect to login
      if (!ciphertext && !fetchOnce) {
        setFetchOnce(true);
        await router.push('/login');
        return;
      }

      // Decrypt user data
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // Set user state
      setUser(decryptedUser);
    };

    fetchUser();
  }, [router, fetchOnce]); // Only re-run the effect if router changes

  return user;
};

export default useUser;
