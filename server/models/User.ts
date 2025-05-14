import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  pic: {
    type: String,
    required: true,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  },
});

const User = mongoose.model("User", UserSchema);
export default User;

export type UserType = {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  pic: string;
  createdAt: Date;
  updatedAt: Date;
};
