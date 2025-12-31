import mongoose from "mongoose";
import User from "./User.model";

const groupSchema = mongoose.Schema({
  //     Group

  // members:[userId]
  // GroupDP:string
  // Admin:userId
  // messages:[message_id]
  // chat:
  // media:[string]
  // groupName: String
  members: [
    {
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  groupDp: {
    type: String,
  },

  media: [
    {
      type: String,
    },
  ],
  groupName: {
    type: String,
    required: true,
  },
});
