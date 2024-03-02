import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  try {
    await mongooseConnect();
    const { userId } = req.body;

    // Find the user and populate the purchaseHistory field
    const user = await Person.findById(userId).populate("purchaseHistory");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Filter the orders to include only those that have been paid for
    const paidOrders = user.purchaseHistory.filter((order) => order.paid);
    // Extract the IDs and names of the items from the paid orders
    const items = paidOrders.flatMap((order) =>
      order.products.map((product) => ({
        orderId: order._id,
        productId: product.id,
        name: product.name,
        image: product.image,
        pdf: product.pdf,
        video: product.video,
        audio: product.audio,
      }))
    );
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
}
