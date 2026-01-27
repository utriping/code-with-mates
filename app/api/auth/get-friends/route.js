import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User.model";
import connectDb from "@/lib/connectDB";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
//friendId milega req me
//If reached here access token must be valid so no need to verify again
export async function POST(req) {
  const { friendId } = await req.json();
  try {
    await connectDb();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access-token")?.value || null;
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded?._id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid user" },
        {
          status: 403,
        },
      );
    }
    if (refreshToken !== user.refreshToken) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        {
          status: 403,
        },
      );
    }
    const friends = user?.friends?.length
      ? await User.find({ _id: { $in: user.friends } }).select(
          "_id name email avatar username state",
        )
      : [];
    return NextResponse.json(
      { success: true, friends: friends },
      { status: 200 },
    );
  } catch (err) {
    console.log("Error in GET /api/auth/get-friends:", err);
    return NextResponse.json(
      {
        success: false,
        error:
          "Internal Server Error while fetching friends because of " +
          err.message,
      },
      { status: 500 },
    );
  }
}
