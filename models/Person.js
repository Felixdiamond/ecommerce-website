import { model, models, Schema, Types } from "mongoose";

const PersonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: [50, "Name cannot be longer than 50 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: [20, "Phone number cannot be longer than 20 characters"],
    },
    image: {
        type: String,
    },
    address: {
      type: String,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    purchaseHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Person = models?.Person || model("Person", PersonSchema);
