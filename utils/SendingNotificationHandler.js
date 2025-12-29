import Notification from "@/models/Notification";
import mongoose from "mongoose";

export default async function SendingNotificationHandler(
  message,
  receiverId,
  senderId
) {
  const newNotification = await Notification.create({
    message: message,
    isRead: false,
    receivedBy: receiverId,
    senderId: senderId,
  });
  return newNotification;
}
