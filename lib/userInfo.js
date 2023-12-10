import { Person } from "@/models/Person";
import { mongooseConnect } from "@/pages/api/mongoose";


export async function fetchUserByEmail(email) {
  try {
    await mongooseConnect();
    const user = await Person.findOne({ email: email });
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
}
