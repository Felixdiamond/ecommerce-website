import { Schema, Types, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    name: String,
    email: String,
    phoneNumber: String,
    paid: Boolean,
    products: [
      {
        name: String,
        id: Types.ObjectId,
        image: String,
        pdf: Schema.Types.Mixed,
        video: Schema.Types.Mixed,
        audio: Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Order = models?.Order || model("Order", OrderSchema);
