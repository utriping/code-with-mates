"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
//generate a test chat frontend
import { io } from "socket.io-client";
export default function Home() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [chatPartner, setChatPartner] = useState(null);
  const [userTyping, setUserTyping] = useState(false);
  const socket = useRef(null);


  // useEffect(() => {
  //   const testApi = async ()=>{
  //     const res = fetch("http://localhost:3000/api/auth/test",{
  //       method:"POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({username:"test",chatId:"test"}),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   }
  // },[])
  useEffect(() => {
    socket.current = io("http://localhost:4000");
    socket.current.on("connect", () => {
      console.log("Connected to server");
    });
    socket.current.on("disconnect", () => {
      setChatPartner(null);
    });

    socket.current.on("typing", (chatId) => {
      setUserTyping(true);
      setTimeout(() => setUserTyping(false), 1000);
    });
    socket.current.on("received-message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log("Got message from another user", msg);
    });
    return () => {
      socket.current.disconnect();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim() === "") return;
    socket.current.emit("send message", chatPartner, currentMessage);
    setCurrentMessage("");
  };

  return (
    <div className="flex flex-col items-center">
      {chatPartner && (
        <div className="mt-4">
          <h1 className="text-3xl font-bold">Chat with {chatPartner}</h1>
          <form onSubmit={sendMessage}>
            <input
              className="w-1/2 px-4 py-2 mt-4 border border-gray-300 rounded-md"
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">
              Send
            </button>
          </form>
          <div className="mt-4">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-center">
                <p className="mr-4">
                  {msg.sender === chatPartner ? "You" : chatPartner}
                </p>
                <p>{msg.content}</p>
              </div>
            ))}
          </div>
          {userTyping && <p>{chatPartner} is typing...</p>}
        </div>
      )}
      {!chatPartner && (
        <div className="mt-4">
          <h1 className="text-3xl font-bold">Join a room</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const roomId = e.target.roomId.value;
              socket.current.emit("join room", roomId);
              e.target.reset();
            }}
          >
            <input
              className="w-1/2 px-4 py-2 mt-4 border border-gray-300 rounded-md"
              type="text"
              name="roomId"
              placeholder="Enter room ID"
            />
            <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md">
              Join
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
