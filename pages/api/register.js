import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";
import bcrypt from 'bcryptjs';

export default async function handle(req, res) {
    mongooseConnect();
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        address,
        image,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const UserDoc = await Person.create({
        name: firstName + " " + lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        address,
        image,
    });
    res.status(200).json({ success: true, data: UserDoc });
}