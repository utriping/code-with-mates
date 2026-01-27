//tested and working
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User.model";
import { cookies } from "next/headers";
import { connectDb } from "@/lib/connectDB";
export async function GET() {
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
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
        expiresIn: "15m",
      },
    );
    const options = {
      httpOnly: true,
      secure: false,
    };
    const response = NextResponse.json(
      { success: true, message: "Access token refreshed successfully" },
      {
        status: 201,
      },
    );
    response.cookies.set("access-token", newAccessToken, options);
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
