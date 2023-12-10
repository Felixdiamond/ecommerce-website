import styled from 'styled-components';
import ProductBox from './ProductBox';

const StyledProductsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 35px;
    margin-bottom: 2rem;
    @media screen and (min-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

export default function ProductsGrid({ products }) {
    return (
        <StyledProductsGrid>
            {products?.length > 0 && products.map(product => (
                    <ProductBox key={product._id} {...product} />
                ))}
        </StyledProductsGrid>
    )
}