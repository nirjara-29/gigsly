import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

let socket;

export function ChatPage() {
  const { problemId } = useParams(); // roomId = problemId
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = { id: Date.now(), name: "You" }; // Replace with auth user info

  useEffect(() => {
    // Connect to socket backend
    socket = io("http://localhost:5000"); // change to your backend URL

    // Join problem room
    socket.emit("join_room", { roomId: problemId, user });

    // Listen for messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("system_message", (msg) => {
      setMessages((prev) => [...prev, { system: true, text: msg.text }]);
    });

    return () => {
      socket.disconnect();
    };
  }, [problemId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      user: user.name,
      text: input,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", { roomId: problemId, message: msg });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card className="h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle>Chat for Problem #{problemId}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-y-auto space-y-3 bg-gray-50 rounded-lg p-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-xs ${
                msg.system
                  ? "mx-auto text-gray-500 text-sm italic"
                  : msg.user === user.name
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-900"
              }`}
            >
              {!msg.system && (
                <p className="text-xs font-semibold mb-1">{msg.user}</p>
              )}
              <p>{msg.text}</p>
              {!msg.system && (
                <p className="text-[10px] mt-1 opacity-70">{msg.time}</p>
              )}
            </div>
          ))}
        </CardContent>

        {/* Input Box */}
        <div className="p-4 border-t flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </Card>
    </div>
  );
}
