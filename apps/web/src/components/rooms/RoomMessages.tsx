"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "@/socket/socket-provider";
import { SocketEvent, Member } from "@repo/shared-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface Message {
  _id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  timestamp: number;
}

export const RoomMessages = ({
  roomCode,
  currentUserId,
}: {
  roomCode: string;
  currentUserId?: string;
}) => {
  const socket = useSocket();
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleMessageReceived = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvent.MESSAGE_CREATED, handleMessageReceived);

    return () => {
      socket.off(SocketEvent.MESSAGE_CREATED, handleMessageReceived);
    };
  }, [socket, handleMessageReceived]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !socket || !user) {
      return;
    }

    setIsSending(true);

    try {
      const newMessage: Message = {
        _id: `${Date.now()}`,
        userId: user.id,
        userName: user.fullName || "Anonymous",
        userImage: user.imageUrl,
        content: inputValue.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputValue("");

      socket.emit(SocketEvent.MESSAGE_SEND, {
        roomCode,
        message: newMessage.content,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message"
      );
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-3 overflow-y-auto mb-4 pr-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="flex gap-3 rounded-lg bg-background/50 p-3 text-sm"
            >
              <img
                src={message.userImage}
                alt={message.userName}
                className="h-8 w-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-xs text-foreground truncate">
                    {message.userName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-foreground break-words text-xs leading-5 mt-1">
                  {message.content}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          disabled={isSending}
          className="text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSendMessage(e as any);
            }
          }}
        />
        <Button
          size="sm"
          type="submit"
          disabled={isSending || !inputValue.trim()}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
};

export default RoomMessages;
