import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  receiverType: {
    type: String,
    enum: ["user", "group"],
    required: true,
  },
  
});
const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
export default Chat;
