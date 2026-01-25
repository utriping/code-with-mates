import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  // sender
  // receiver
  // createdAt
  // content
  // receiverType:"user",
  // "group"
  sender: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  receiverType: {
    type: String,
    enum: ["user", "group"],
    required: true,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;
