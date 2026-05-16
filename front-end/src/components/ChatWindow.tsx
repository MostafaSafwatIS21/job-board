import { useState, useEffect } from "react";
import { api, getAuthToken } from "@/utils/api";
import echo from "../utils/echo";

type ChatUser = {
  id: number | string;
  name?: string;
};

type ChatMessage = {
  id: number | string;
  sender_id: number | string;
  receiver_id: number | string;
  body: string;
  created_at: string;
};

type ChatWindowProps = {
  currentUser?: ChatUser | null;
  activeContact?: ChatUser | null;
};

const ChatWindow = ({ currentUser, activeContact }: ChatWindowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!currentUser || !activeContact) {
      return;
    }

    let isMounted = true;
    api
      .get<{ data: ChatMessage[] }>("/messages", {
        params: { contact_id: activeContact.id },
        headers: {
          Authorization: `Bearer ${getAuthToken() ?? ""}`,
        },
      })
      .then((res) => {
        if (isMounted) setMessages(res.data.data ?? []);
      })
      .catch(() => {
        if (isMounted) setMessages([]);
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser, activeContact]);

  // 1. Listen for incoming messages
  useEffect(() => {
    if (!currentUser || !activeContact) return;

    const channelName = `chat.${currentUser.id}`;
    const channel = echo.private(channelName);

    channel.listen(".MessageSent", (event: ChatMessage) => {
      if (String(event.sender_id) === String(activeContact.id)) {
        setMessages((prev) => [...prev, event]);
      }
    });

    return () => {
      channel.stopListening(".MessageSent");
      echo.leaveChannel(channelName);
    };
  }, [currentUser, activeContact]);

  // 2. Handle sending a message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !activeContact || !newMessage.trim()) return;

    // Optimistically update the UI so the sender sees it instantly
    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      sender_id: currentUser.id,
      receiver_id: activeContact.id,
      body: newMessage,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      await api.post(
        "/messages",
        {
          receiver_id: activeContact.id,
          body: optimisticMessage.body,
        },
        {
          headers: {
            Authorization: `Bearer ${getAuthToken() ?? ""}`,
          },
        },
      );
    } catch (error) {
      console.error("Message failed to send", error);
      // Optional: Remove the optimistic message or show a retry icon
    }
  };

  return (
    <div className="chat-window">
      <div
        className="messages-area"
        style={{ height: "400px", overflowY: "scroll" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.sender_id === currentUser?.id ? "right" : "left",
            }}
          >
            <p
              style={{
                background:
                  msg.sender_id === currentUser?.id ? "#dcf8c6" : "#fff",
                padding: "10px",
                borderRadius: "5px",
                display: "inline-block",
              }}
            >
              {msg.body}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend}>
        <div className="border-border/70 bg-card p-2 mt-2 flex gap-2  m-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className=" p-3 border-2 "
          />
          <button
            type="submit"
            className=" bg-gray-500 p-5 text-white rounded-xs hover:bg-gray-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
