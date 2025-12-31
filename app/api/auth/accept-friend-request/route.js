import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDb } from "@/lib/connectDB";
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest.model";

export async function POST(req) {
  //req will have senderId(senderId) in body
  const session = await getServerSession(authOptions);
  if (
    !session?.user?._id ||
    !mongoose.Types.ObjectId.isValid(session.user._id)
  ) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  const userId = mongoose.Types.ObjectId(session.user._id);
  const body = await req.json();
  try {
    await connectDb();
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }
    const potentialFriendIdtemp = body.senderId;
    if (!mongoose.Types.ObjectId.isValid(potentialFriendIdtemp)) {
      return NextResponse.json(
        { success: false, error: "Invalid friend ID" },
        { status: 400 }
      );
    }
    const potentialFriendId = mongoose.Types.ObjectId(potentialFriendIdtemp);
    //check if the user is already friends with potentialFriend
    const isFriend = user.friends?.some((obj) =>
      obj.friendId.equals(potentialFriendId)
    );
    if (isFriend) {
      return NextResponse.json(
        { message: "That user is already your friend" },
        { status: 400 }
      );
    }
    //put the potentialFriend in ObjectId format and store in friends model
    const potentialFriend = await User.findOne({ _id: potentialFriendId });
    if (!potentialFriend) {
      return NextResponse.json(
        { success: false, error: "Potential friend not found" },
        { status: 404 }
      );
    }
    // Add the friend to the user's friends list
    await User.findByIdAndUpdate(userId, {
      $push: {
        friends: { friendId: potentialFriend._id },
      },
    });

    // Add the user to the potential friend's friends list
    await User.findByIdAndUpdate(potentialFriend._id, {
      $push: {
        friends: { friendId: userId },
      },
    });
    //delete friend request document
    await FriendRequest.deleteOne({
      senderId: potentialFriend._id,
      receiverId: userId,
    });
    // Remove the friend request from the user's pending received requests
    // if (user.pendingReceivedRequests.includes(potentialFriend._id)) {
    //   await User.findByIdAndUpdate(userId, {
    //     $pull: {
    //       pendingReceivedRequests: potentialFriend._id,
    //     },
    //   });
    // }
    // Remove the friend request from the potential friend's pending sent requests
    // await User.findByIdAndUpdate(potentialFriend._id, {
    //   $pull: {
    // pendingSentRequests: userId,
    //   },
    // });
    return NextResponse.json(
      { success: true, message: "Friend request accepted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in accepting friend request: ", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
