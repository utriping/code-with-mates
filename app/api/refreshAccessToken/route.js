import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User.model";
export async function POST(req) {
  const cookies = cookies();
  const refreshToken = cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json(
      { success: false, error: "User is not authorized" },
      {
        status: 403,
      },
    );
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = User.findById(decoded?._id);
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
        { success: false, error: "User is not authorized" },
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
    return NextResponse.json(
      {
        success: false,
        error: "User is not authorized and has to sign in again",
      },
      {
        status: 403,
      },
    );
  }
}
