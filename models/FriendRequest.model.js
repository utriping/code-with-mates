import mongoose from "mongoose";

export const FriendRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const FriendRequest =
  mongoose.models.FriendRequest ||
  mongoose.model("FriendRequest", FriendRequestSchema);
export default FriendRequest;
