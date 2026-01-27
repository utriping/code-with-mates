"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ChatFriendsList } from "@/components/chat/chat-friends-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { apiClient } from "@/lib/api-client";
import { useAppContext } from "@/providers/app-provider";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/axiosRequestConfig";
export default function ChatPage() {
  const { friendId } = useParams();
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(friendId);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useAppContext();

  const selectedFriend = friends.find((f) => f.id === selectedFriendId);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await api
          .post(
            "/api/auth/get-friends",
            // {friendId}).then((res)=>{
            // if(res.status>=400)
            // }
            { friendId },
          )
          .then((res) => res.json());
        setFriends(data);
      } catch (error) {
        console.error("[v0] Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [state.currentUser.id]);

  useEffect(() => {
    if (selectedFriendId) {
      fetchMessages();
    }
  }, [selectedFriendId]);

  const fetchMessages = async () => {
    try {
      const data = await apiClient.getChatMessages(selectedFriendId);
      setMessages(data);
      // Mark as read
      await apiClient.markMessagesAsRead(selectedFriendId);
    } catch (error) {
      console.error("[v0] Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      const newMessage = await apiClient.sendMessage(
        state.currentUser.id,
        selectedFriendId,
        messageText,
      );
      setMessages((prev) => [...prev, newMessage]);

      // Dispatch to global state
      dispatch({
        type: "ADD_CHAT_MESSAGE",
        friendId: selectedFriendId,
        payload: newMessage,
      });
    } catch (error) {
      console.error("[v0] Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-140px)]">
            {/* Friends List - Hidden on mobile, visible on md and up */}
            <div className="hidden md:block">
              <ChatFriendsList
                friends={friends}
                selectedId={selectedFriendId}
                onSelectFriend={setSelectedFriendId}
              />
            </div>

            {/* Chat Window */}
            <div className="md:col-span-2">
              <ChatWindow
                friend={selectedFriend}
                messages={messages}
                onSendMessage={handleSendMessage}
                currentUser={state.currentUser}
              />
            </div>
          </div>

          {/* Mobile Friends List - Only visible on mobile */}
          {!selectedFriend && (
            <div className="md:hidden">
              <ChatFriendsList
                friends={friends}
                selectedId={selectedFriendId}
                onSelectFriend={setSelectedFriendId}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
