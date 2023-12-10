import { model, Schema, Types } from "mongoose";

const ProductSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [40, "Title cannot be more than 40 characters"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please add a price"],
    maxlength: [5, "Price cannot be more than 5 characters"],
  },
  discountPrice: {
    type: Number,
    maxlength: [5, "Discount Price cannot be more than 5 characters"],
  },
  images: {
    type: [{ type: String }],
  },
  category: {
    type: Types.ObjectId,
    ref: "Category",
  },
  properties: {
    type: Object,
  },
}, {
  timestamps: true,
});

let Product;

try {
  Product = model('Product');
} catch (error) {
  Product = model('Product', ProductSchema);
}

export { Product };



// hey i'm so confused rn. my user model :

// import { Schema, model, models, Types } from 'mongoose';

// const UserSchema = new Schema({

//     name: {

//         type: String,

//         required: [true, "Please add a title"],

//         trim: true,

//         maxlength: [40, "Title cannot be more than 40 characters"],

//       },

//       email: {

//         type: String,

//         required: [true, "Please add an email"],

//         unique: true,

//         match: [

//           /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

//           "Please add a valid email",

//         ],

//       },

//       phoneNumber: {

//         type: String,

//         required: [true, "Please add a phone number"],

//         maxlength: [20, "Phone number cannot be longer than 20 characters"],

//       },

//       address: {

//         type: String,

//         required: [true, "Please add an address"],

//         maxlength: [100, "Address cannot be longer than 100 characters"],

//       },

//       password: {

//         type: String,

//         required: [true, "Please add a password"],

//         minlength: 6,

//         select: false,

//       },

//       image: {

//         type: { type: String },

//       },

//       favorites: {

//         type: [{ type: Types.ObjectId, ref: "Product" }],

//       },

//       cart: {

//         type: [{ type: Types.ObjectId, ref: "Product" }],

//       },

//       orders: {

//         type: [{ type: Types.ObjectId, ref: "Order" }],

//       },

// })

// export const User = models?.User || model('User', UserSchema);

// gets some stuffs from other models like what we did with that ref the other time but i'm really confused rn. favorites is supposed to be an array of products added from the Product which looks like this:import { model, Schema, Types } from "mongoose";

// const ProductSchema = new Schema({
//   title: {
//     type: String,
//     required: [true, "Please add a title"],
//     trim: true,
//     maxlength: [40, "Title cannot be more than 40 characters"],
//   },
//   description: {
//     type: String,
//     required: [true, "Please add a description"],
//     maxlength: [200, "Description cannot be more than 200 characters"],
//   },
//   price: {
//     type: Number,
//     required: [true, "Please add a price"],
//     maxlength: [5, "Price cannot be more than 5 characters"],
//   },
//   discountPrice: {
//     type: Number,
//     maxlength: [5, "Discount Price cannot be more than 5 characters"],
//   },
//   images: {
//     type: [{ type: String }],
//   },
//   category: {
//     type: Types.ObjectId,
//     ref: "Category",
//   },
//   properties: {
//     type: Object,
//   },
// }, {
//   timestamps: true,
// });

// let Product;

// try {
//   Product = model('Product');
// } catch (error) {
//   Product = model('Product', ProductSchema);
// }

// export { Product };

// It's supposed to add the id of the product when the heart is clicked and remove it when its clicked again. but idk how to wrap my head around the logic rn. similar 

