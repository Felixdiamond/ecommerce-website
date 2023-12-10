import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";

export default async function handler(req, res) {
    try {
        await mongooseConnect();
        const { productId, userId } = req.body;
        const user = await Person.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.favorites.includes(productId)) {
            await Person.findByIdAndUpdate(
                userId,
                { $pull: { favorites: productId } },
                { new: true, useFindAndModify: false },
            );
        } else {
            await Person.findByIdAndUpdate(
                userId,
                { $push: { favorites: productId } },
                { new: true, useFindAndModify: false },
            );
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false });
    }
}
