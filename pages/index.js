import ControlledCarousel from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export default function HomePage({ featuredProduct, newProducts, user }) {
  return (
    <div>
      <Header user={user} />
      <ControlledCarousel />
      <NewProducts products={newProducts} user={user} />
    </div>
  );
}

export async function getServerSideProps() {
  await mongooseConnect();
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
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      lazyOrder: JSON.parse(JSON.stringify(lazyOrder)),
    },
  };
}
