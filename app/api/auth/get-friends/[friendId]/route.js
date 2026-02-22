//not tested yet but seems fine
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User.model";
import connectDb from "@/lib/connectDB";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import checkTokens from "@/lib/checkTokens";
//friendId milega req me
//If reached here access token must be valid so no need to verify again
export async function GET(req) {
  try {
    await connectDb();
    const cookieStore = await cookies();
    const { valid, decoded, accessToken, refreshToken } =
      checkTokens(cookieStore);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    const user = await User.findById(decoded?._id).select("friends refreshToken");
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
