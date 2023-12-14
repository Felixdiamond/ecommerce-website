import styled from 'styled-components';
import ProductBox from './ProductBox';
import { useEffect, useState } from 'react';
import supabase from '@/lib/connSupa';
import axios from 'axios';

const StyledProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 35px;
    margin-bottom: 2rem;
    @media screen and (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

export default function ProductsGrid({ products, user }) {
    const [dbUser, setDbUser] = useState({});
    const [session, setSession] = useState({});
    const [calledAlready, setCalledAlready] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchSession = async () => {
          const session = await supabase.auth.getSession();
          setSession(session);
        };
    
        fetchSession();
      }, []);
    
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
                  setDbUser(res.data.data);
                  setLoading(false);
                })
                .catch((error) => {
                  console.error("Error in axios.post:", error);
                });
            } catch (error) {
              console.error(error);
            }
          }
        };
        fetchCurrentUser();
      }, [session]);

    return (
        <StyledProductsGrid>
            {products?.length > 0 && products.map(product => (
                    <ProductBox key={product._id} {...product} user={user} userFavs={dbUser?.favorites} />
                ))}
        </StyledProductsGrid>
    )
}