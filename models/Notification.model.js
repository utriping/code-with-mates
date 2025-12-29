import mongoose from "mongoose";

// import Notification from "@/models/Notification";
// import mongoose from "mongoose";

// export default async function SendingNotificationHandler(
//   message,
//   receiverId,
//   senderId
// ) {
//   const newNotification = await Notification.create({
//     message: message,
//     isRead: false,
//     receivedBy: receiverId,
//     senderId: senderId,
//   });
//   return newNotification;
// }

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.model.Notification ||
  mongoose.model("Notification", notificationSchema);
export default Notification;
