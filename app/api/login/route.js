import { connectDb } from "@/lib/connectDB";
import User from "@/models/User.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  //req me either username or email and password milega
  //password check karna hai bcrypt se, if failed return
  //user id milega, usse user milega
  // if(access token valid nahi hoga) naya access token dena hai
  // uska refresh token validate karna hai, if not create new refresh token and apply

  const { username, email, password } = req.json();
  try {
    if ((!username && !email) || !password) {
      return NextResponse.json(
        { success: false, error: "Missing login credentials" },
        { status: 400 },
      );
    }

    await connectDb();
    let query = {};
    if (!username) {
      query.email = email;
    } else {
      query.username = username;
    }
    const user = User.findOne(query);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not created please sign up",
        },
        { status: 404 },
      );
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 400 },
      );
    }
    const newRefreshToken = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );
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
    user.refreshToken = newRefreshToken;
    await user.save();
    const options = {
      httpOnly: true,
      secure: false,
    };
    const userData = user.select("-password -refreshToken");
    const response = NextResponse({
      status: 200,
      message: "User Logged In successfully",
      data: userData,
    });
    response.cookies.set("refresh-token", newRefreshToken, options);
    response.cookies.set("access-token", newAccessToken, options);
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong while logging in", success: false },
      {
        status: 500,
      },
    );
  }
}
