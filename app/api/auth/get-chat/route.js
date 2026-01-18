import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User.model";
import { useSearchParams } from "next/navigation";
import Chat from "@/models/Chat.model";
import connectDb from "@/lib/mongoose/connectDb";

//this will require a middleware using aggregation pipelines for filling chat model with messages and also responsible for sorting it based on the messages createdAt field

//this complete route needs to be figured out again

export async function POST() {
  try {
    const session = await getServerSession();
    const { friendId, isGroup } = req.body;
    if (!friendId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    if (
      !session?.user?._id ||
      !mongoose.Types.ObjectId.isValid(session.user._id)
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    await connectDb();
    //we will get a chat id from the middleware figure it out later how we are going to do it
    const chatId = req.nextUrl.searchParams.get("chatId");
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chatId" });
    }
    const chat = await Chat.findById(chatId).select({
      chatId: 1,
      messages: { $slice: -50 },
    });

    if (!chat) {
      return NextResponse.json(
        { success: false, error: "Chat not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, chat: chat }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
