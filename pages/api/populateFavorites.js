import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";

export default async function handler(req, res) {
    try {
        await mongooseConnect();
        const { userId } = req.body;

        // Find the user and populate the favorites field
        const user = await Person.findById(userId).populate('favorites');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false });
    }
}
