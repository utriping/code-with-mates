import { connectDb } from "@/lib/connectDB";
import User from "@/models/User.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

//avatar, coverphoto,bio feature not added all this will be in profile creation route
export async function POST(req) {
  //req me username, password aayega jo user form bharega aur name field me rahega sab
  //voh saare fields se user create karna hai
  //password ko encrypt karna hai
  //   refresh token create karna hai
  //  user ko create karna hai
  const { username, name, password, email } = await req.json();
  if (!username || !name || !password || !email) {
    return NextResponse(
      {
        success: false,
        error: "Request fields missing",
      },
      { status: 400 },
    );
  }
  try {
    await connectDb();
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User alreay exists",
        },
        { status: 409 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      name: name,
      password: hashedPassword,
      email: email,
    });
    const createdUser = user.select("-password -refreshToken");
    return NextResponse.json(
      { success: true, message: "User has been created", data: createdUser },
      {
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong while creating the user", status: 500 },
      {
        success: false,
      },
    );
  }
}
