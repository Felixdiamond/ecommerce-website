import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";
import { getSession } from "next-auth/react";
import NextAuth from "next-auth";
import bcrypt from 'bcrypt';


const authOptions = NextAuth.authOptions;

export default async function handle(req, res) {
  await mongooseConnect();

  const { email, password } = req.body;

  let session = await getSession({ req });

  if (session) {
    // Already logged in
    res.send({ user: session.user });
  } else {
    // Not logged in
    try {
      // Find user by email
      const user = await Person.findOne({ email });

      console.log(user);

      // Check password match
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid email or password");
      }

      session = await authOptions.session({
        userId: user._id,
      });

      await session.save();
      res.json({ session: session.id });
    } catch (error) {
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      res.status(401).json({ message: "Invalid credentials" });
    }    
  }
}
