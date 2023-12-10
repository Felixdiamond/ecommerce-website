import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default function HomePage({ featuredProduct, newProducts }) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct} />
      <NewProducts products={newProducts} />
    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = "6574bd554029d5563b8f32e1";
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {
    sort: { _id: -1 },
    limit: 10,
  });
  await Order.findOneAndDelete({ name: "Lazy Order" });

  // Create the new order
  const lazyOrder = await Order.create({
    name: "Lazy Order",
    email: "lazyy",
    phoneNumber: "08012345678",
    paid: false,
    products: [],
  });
  return {
    props: {
      featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      lazyOrder: JSON.parse(JSON.stringify(lazyOrder)),
    },
  };
}

// http://localhost:9000/books-bucket/file-1698531436200.png
