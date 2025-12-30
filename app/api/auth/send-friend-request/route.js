//http://localhost:5000/api/auth/send-friend-request
import User from "@/models/User";
import FriendRequest from "@/models/FriendRequest.model";
import { connectDb } from "@/lib/connectDB";
import mongoose, { connect } from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import SendingNotificationHandler from "@/utils/SendingNotificationHandler";
export async function POST(req) {
  //user:
  // pendingSentRequests, friends, pendingReceivedRequests
  //user milega after authorization
  //user ka isVerified false hoga toh return message you need to verify your email before sending friend requests
  //body se friend ka id milega
  //find that user
  //check if already friend, if yes return message already friend,
  //else, send email
  //push the sender user id into potential-friend's user id's friendRequests array
  // push the potential-friend's into pendingRequest array of the user
  //note: voh user accept karega tab add-friend ka route hit karna hai nothing to do here
  //req.body={
  // friend_id: "...",
  // }

  const body = await req.json();
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
  try {
    await connectDb();
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return new Response(
        JSON.stringify({
          message:
            "You need to verify your email before sending friend requests",
        }),
        { status: 400 }
      );
    }
    if (!mongoose.Types.ObjectId.isValid(body.friend_id)) {
      return NextResponse.json(
        { success: false, error: "Invalid friend ID" },
        { status: 400 }
      );
    }
    const friendId = mongoose.Types.ObjectId(body.friend_id);
    //create a friend request document
    const postentialFriend = await User.findOne({
      _id: friendId,
    });
    if (!postentialFriend) {
      return NextResponse.json(
        { success: false, error: "Friend not found" },
        { status: 404 }
      );
    }
    if (!postentialFriend.isVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot send friend request to unverified user",
        },
        { status: 400 }
      );
    }
    // const isFriend = user.friends.some(
    //   (obj) => obj.friendId.equals(postentialFriend._id)
    //   //[{friendId: ObjectId("...")}, {...}]
    // );
    // if (isFriend) {
    //   return NextResponse.json(
    //     { message: "That user is already your friend" },
    //     { status: 400 }
    //   );
    // }
    // const isPendingRequest = user.pendingSentRequests.some((obj) =>
    //   obj.friendId.equals(postentialFriend._id)
    // );

    // const isReceivedRequest = postentialFriend.pendingReceivedRequests.some(
    //   (obj) => obj.friendId.equals(user._id)
    // );

    const newFriendRequest = await FriendRequest.create({
      senderId: userId,
      receiverId: postentialFriend._id,
    });

    // if (isPendingRequest || isReceivedRequest) {
    //   return NextResponse.json(
    //     { message: "You have already sent a friend request to this user" },
    //     { status: 400 }
    //   );
    // }

    //send email logic can be added here
    //send notification logic can be added here
    const notification = await SendingNotificationHandler(
      `You have received a friend request from ${user.name}`,
      postentialFriend._id,
      userId
    );

    // await User.findByIdAndUpdate(userId, {
    //   $push: {
    //     pendingSentRequests: postentialFriend._id,
    //   },
    // });
    // await User.findByIdAndUpdate(postentialFriend._id, {
    //   $push: {
    //     friendRequests: session.user._id,
    //   },
    // });
    return NextResponse.json(
      { message: "Friend request sent successfully", notification },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in sending friend request: ", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
