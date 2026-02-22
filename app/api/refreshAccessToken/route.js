//tested and working
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User.model";
import { cookies } from "next/headers";
import { connectDb } from "@/lib/connectDB";
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh-token")?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, error: "User is not authorized" },
      {
        status: 403,
      },
    );
  }
  try {
    await connectDb();
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 403 },
      );
    }
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
    const newAccessToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "30m",
      },
    );
    const options = {
      httpOnly: true,
      secure: false,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "Access token refreshed successfully",
      },
      {
        status: 201,
      },
    );
    response.cookies.set("access-token", options);
    return response;
  } catch (err) {
    console.log("Error in refreshing access token: ", err);
    return NextResponse.json(
      {
        success: false,
        error: "User is not authorized and has to sign in again" + err.message,
      },
      {
        status: 403,
      },
    );
  }
}
