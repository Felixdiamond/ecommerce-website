import { Schema, model, models, Types } from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please add a title"],
        trim: true,
        maxlength: [40, "Title cannot be more than 40 characters"],
      },
      email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      phoneNumber: {
        type: String,
        required: [true, "Please add a phone number"],
        maxlength: [20, "Phone number cannot be longer than 20 characters"],
      },
      address: {
        type: String,
        required: [true, "Please add an address"],
        maxlength: [100, "Address cannot be longer than 100 characters"],
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false,
      },
      image: {
        type: { type: String },
      },
      favorites: {
        type: [{ type: Types.ObjectId, ref: "Product" }],
      },
      cart: {
        type: [{ type: Types.ObjectId, ref: "Product" }],
      },
      orders: {
        type: [{ type: Types.ObjectId, ref: "Order" }],
      },
})

export const User = models?.User || model('User', UserSchema);