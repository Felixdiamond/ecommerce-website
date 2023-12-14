import axios from 'axios';
import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
        email,
        amount,
        phoneNumber,
        name,
        products,
        pdf,
        video,
        audio,
        userId,
    } = req.body;

    await mongooseConnect();

    const orderDoc = await Order.create({
        name,
        email,
        phoneNumber,
        paid: false,
        products: products,
        pdf: pdf,
        audio: audio,
        video: video,
      });

    try {
      const response = await axios({
        url: 'https://api.paystack.co/transaction/initialize',
        method: 'post',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          email,
          amount,
          metadata: {
            name,
            phoneNumber,
            userId,
            orderId: orderDoc._id.toString()
          },
          callback_url: process.env.NEXT_PUBLIC_PAYSTACK_CALLBACK_URL + "/cart?success=1",
        },
      });


      if (response.data.status) {
        console.log(response.data);
        return res.status(200).json({ url: response.data.data.authorization_url });
      }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.response.data.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
