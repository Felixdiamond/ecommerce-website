import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";

export default async function handler(req, res) {
  try {
    const { email } = req.body;
    await mongooseConnect();
    const user = await Person.findOne({ email: email });
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false });
  }
}