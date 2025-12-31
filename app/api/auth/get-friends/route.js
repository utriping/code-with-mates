import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User.model";
export async function GET() {
  const session = await getServerSession(authOptions);
  try {
    if (
      !session?.user?._id ||
      !mongoose.Types.ObjectId.isValid(session.user._id)
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    await connectDb();
    const userId = new mongoose.Types.ObjectId(session.user._id);
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const friends = await User.find({ _id: { $in: user.friends } }).select(
      "_id name email avatar username state"
    );
    if (!friends) {
      return NextResponse.json(
        { success: false, error: "You have no friends" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, friends: friends },
      { status: 200 }
    );
  } catch (err) {
    console.log("Error in GET /api/auth/get-friends:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
