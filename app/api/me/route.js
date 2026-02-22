import { connectDb } from "@/lib/connectDB";
import User from "@/models/User.model.js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function GET(req) {
  try {
    const cookieStore = await cookies();
    const { valid, decoded, refreshToken, accessToken } =
      await checkTokens(cookieStore);
    await connectDb();
    if (!valid || !decoded || !refreshToken || !accessToken) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid login credentials" },
        { status: 401 },
      );
    }
    const user = await User.findById(decoded._id);
    if (!user) {
      if (!valid || !decoded || !refreshToken || !accessToken) {
        return NextResponse.json(
          { success: false, error: "Missing user" },
          { status: 401 },
        );
      }
      const safeUser = user.toObject();
      delete safeUser.password;
      delete safeUser.refreshToken;
      return NextResponse.json(
        { success: true, data: safeUser },
        { status: 200 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, error: `Couldn't find user ${err.message}` },
      { status: 400 },
    );
  }
}
