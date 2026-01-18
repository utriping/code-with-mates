"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
//generate a test chat frontend
import { io } from "socket.io-client";
export default function Home() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io("http://localhost:4000");
    socket?.current.on("connect", () => {
      console.log("Connected to server");
    });
    socket?.current.on("received message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      console.log("Got message from another user", msg);
    });
    socket?.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    return () => {
      socket?.current.disconnect();
    };
  }, []);
  return (
    <div className="flex flex-col items-center">
      <input
        className="w-1/2 px-4 py-2 mt-4 border border-gray-300 rounded-md"
        type="text"
        placeholder="Enter a message"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />
      <button
        onClick={(e) => {
          console.log(currentMessage);
          socket?.current.emit("send message", currentMessage);
          setCurrentMessage("");
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4"
      >
        Send Message
      </button>

      <div className="mt-4 text-gray-500 text-sm mb-2 ">Previous Messages</div>

      {messages.map((message, index) => (
        <div
          className="bg-gray-200 p-2 rounded-md mb-2 font-bold text-black"
          key={index}
        >
          <p>{message}</p>
        </div>
      ))}
      {/* on clicking send button store the input inan */}
    </div>
  );
}
