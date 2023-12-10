import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { mongooseConnect } from "@/lib/mongoose";
import { Person } from "@/models/Person";
import bcrypt from "bcrypt";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";

async function clientPromise() {
  await mongooseConnect();
  return mongoose.connection.getClient();
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        await mongooseConnect();

        const user = await Person.findOne({ email: credentials.email });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          // console.log(
          //   `yo, the return statement is def running ${user._id.toString()}`
          // );
          // Convert the user object to a JSON string before returning it
          // console.log("User object in authorize:", user);
          // return Promise.resolve(user);
          // Store the user information in the database
          await Person.updateOne(
            { _id: user._id },
            { $set: { sessionInfo: user } }
          );

          return user;
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  // ],
  // secret: process.env.NEXTAUTH_SECRET,
  // session: {
  //   strategy: "jwt",
  //   jwt: true,
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
  callbacks: {
    // async jwt(token, user) {
    //   // if (user) user = user;
    //   // if (user) token.id = user.email;
    //   // console.log("Token and user objects in jwtt:", token, user);
    //   // return token;
    //   console.log("JWT User:", user)
    //   if (user) {
    //     console.log("\n\nI ran!!\n\n");
    //     token.user = user;
    //   }
    //   return token;
    // },
    // async session(session, token) {
    //   // Log the session and token objects before modifying them
    //   // console.log("Session and token objects in session:", session, token);
    //   if (!token) {
    //     // console.log("No token in session");
    //     // return session;
    //     session.user = {
    //       name: "Yooo",
    //       email: "hello@Ggmail.com",
    //       image: "/images/avatars/avatar_1.png",
    //       address: "1234 Main St",
    //       phoneNumber: "123-456-7890",
    //       favorites: [],
    //       purchaseHistory: [],
    //     };
    //   }

    //   if (token) {
    //     console.log("Token in session:", token);
    //   }
    //   // Log the session object after modifying it
    //   // console.log("Session object in session:", session);
    //   return session;
    // },
    async session(session, token) {
      await mongooseConnect();

      // Retrieve the user information from the database
      const user = await Person.findOne({ _id: session.user._id });

      if (user) {
        // Add the user information to the session object
        session.user = user.sessionInfo;
        console.log("Session object in session:", session);
      }

      return session;
    },
  },
});

// Seyifunmi@14
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJva215Z2ZkeW51Zm9jYWtocHJlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTc5MDA2MSwiZXhwIjoyMDE3MzY2MDYxfQ.KUqWxy1wla8KA3jF8oTpFUS_1QSSjkCGCKDGcdZtH38