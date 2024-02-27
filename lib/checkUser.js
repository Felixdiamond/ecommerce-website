import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const useUser = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Move secretKey outside the effect for consistency and potential caching
  const secretKey = useMemo(() => process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY, []);

  const fetchUser = useCallback(async () => {
    // Pre-fetch ciphertext to avoid multiple Cookies.get() calls
    const ciphertext = Cookies.get('user');

    if (!ciphertext) {
      await router.push('/login');
      setLoading(false);
      return;
    }

    try {
      // Decrypt user data
      const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
      const decryptedUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // Set user state
      setUser(decryptedUser);
    } catch (error) {
      // Handle decryption errors appropriately
      console.error('Error decrypting user data:', error);
      await router.push('/login');
    }
    setLoading(false);
  }, [router, secretKey]);

  useEffect(() => {
    if (loading) {
      fetchUser();
    }
  }, [fetchUser, loading]);

  return user;
};

export default useUser;