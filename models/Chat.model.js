import mongoose from "mongoose";
//isme sab message nahi daalna hai meessage ko aggregate karke hi lenge jab chat ke liye chaiye hoga
const chatSchema = new mongoose.Schema(
  {
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      required: true,
    },
    receiverType: {
      type: String,
      enum: ["user", "group"],
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true },
);
const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;
