import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
    try {
        const { _id } = req.body;
        await mongooseConnect();
        const product = await Product.findById(_id);
        res.status(200).json({ success: true, data: product });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false });
    }
}