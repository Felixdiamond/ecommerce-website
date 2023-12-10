import { mongooseConnect } from "@/lib/mongoose"; 
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";
import ProductsGrid from "@/components/ProductsGrid";
import styled from "styled-components";


const StyledHeader = styled.h2`
    margin-top: 2rem;
`;

export default function Categories({ products }) {

  const groupedProducts = products.reduce((acc, product) => {
    
    const group = acc[product.category._id] || [];
    
    group.push(product);

    acc[product.category._id] = group;

    return acc;

  }, {});

  return (
    <>
      <Header />

      <Center>
        <Title>Categories</Title>  

        {Object.keys(groupedProducts).map(catId => {
          
          // Get name from first product  
          const categoryName = groupedProducts[catId][0].category.name;

          return (
            <>
              <StyledHeader>{categoryName}</StyledHeader>
              
              <ProductsGrid 
                products={groupedProducts[catId]}
              />
            </>  
          )
        })}

      </Center>
    </>
  );
}

export async function getServerSideProps() {

  await mongooseConnect();
  // Populate category references 
  const products = await Product.find({}).populate('category');

  return {
    props: {
      products: JSON.parse(JSON.stringify(products))
    }
  };
}