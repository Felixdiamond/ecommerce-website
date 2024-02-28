import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Person } from "@/models/Person";
import { buffer } from "micro";

export default async function handler(req, res) {
  mongooseConnect();

  // Parse the incoming request body
  const buf = await buffer(req);
  const body = JSON.parse(buf.toString());

  if (body.event === "charge.success") {
    // Handle the event
    const data = body.data;
    const orderId = data.metadata.orderId;
    const payment_status = data.status;
    const userId = data.metadata.userId;
    console.log("Payment status: ", payment_status);
    console.log("Order ID: ", orderId);
    console.log("User ID: ", userId);
    if (orderId && payment_status === "success") {
      try {
        const result = await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
        console.log("Updated order");
        console.log(result);

        // Update the user's purchase history
        const res2 = await Person.findByIdAndUpdate(
          userId,
          { $push: { purchaseHistory: orderId } },
          { new: true, useFindAndModify: false }
        );
        console.log("Updated user's purchase history");
        console.log(res2);
      } catch (err) {
        console.error(`Error updating order ${orderId}: `, err);
      }
    }
  }

  res.status(200).end();
}

export const config = {
  api: { bodyParser: false },
};
