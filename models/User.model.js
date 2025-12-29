import mongoose from "mongoose";
import { FriendRequestSchema } from "./FriendRequest.model.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
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
    friends: [
      //an array of objects containing friendId(ObjectId of User)
      {
        friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    pendingSentRequests: [FriendRequestSchema], //array of ObjectId of Users
    pendingReceivedRequests: [FriendRequestSchema], //array of ObjectId of Users
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    coverPhotoUrl: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    //the state could be any of the three: online, offline, busy
    //what is enum? enum is a special type that allows only specific values
    state: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },
  },
  { timestamps: true }
);
//what was the need of the above line and explain them please
const User = mongoose.models.User || mongoose.model("User", userSchema); //this line checks if the User model already exists in mongoose.models, if it does, it uses that existing model. If it doesn't, it creates a new model using the userSchema defined above. This is useful in serverless environments where the code might be re-executed multiple times, preventing model overwrite errors.

export default User;
