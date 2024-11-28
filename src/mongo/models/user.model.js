import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  age: {
    type: Number,
  },
  cart: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "cart" },
  role: {
    type: String,
    default: "user"
  },
});


export const userModel = mongoose.model(userCollection, userSchema);
