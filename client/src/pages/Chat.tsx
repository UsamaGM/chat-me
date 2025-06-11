import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { FileUpload } from "../components/FileUpload";
import { MessageReactions } from "../components/MessageReactions";
import { TypingIndicator } from "../components/TypingIndicator";
import { UserStatus } from "../components/UserStatus";
import { SearchBar } from "../components/SearchBar";
import { io, Socket } from "socket.io-client";
import axios from "axios";

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 300px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const MessageInput = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
`;

const Message = styled.div<{ isOwn: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isOwn ? "flex-end" : "flex-start")};
  margin-bottom: 20px;
`;

const MessageContent = styled.div<{ isOwn: boolean }>`
  background-color: ${(props) => (props.isOwn ? "#2196f3" : "#f5f5f5")};
  color: ${(props) => (props.isOwn ? "white" : "black")};
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const MessageSender = styled.span`
  font-weight: 500;
  color: #666;
`;

const MessageTime = styled.span`
  font-size: 0.8rem;
  color: #999;
`;

interface Message {
  _id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    isOnline: boolean;
    lastSeen: Date;
  };
  chat: string;
  createdAt: Date;
  attachments?: Array<{
    type: string;
    name: string;
    size: number;
  }>;
  reactions?: Array<{
    emoji: string;
    users: string[];
  }>;
}

interface SearchResult {
  id: string;
  title: string;
  type: "message" | "user";
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const socketRef = useRef<Socket>();
  const chatId = "current-chat-id"; // Replace with actual chat ID

  useEffect(() => {
    socketRef.current = io(
      process.env.REACT_APP_SOCKET_URL || "http://localhost:5000"
    );

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("join-chat", chatId);
    });

    socketRef.current.on("chat-updated", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on("user-typing", ({ userId }) => {
      setTypingUsers((prev) => [...prev, userId]);
    });

    socketRef.current.on("user-stopped-typing", ({ userId }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [chatId]);

  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const message = {
      content: newMessage,
      chat: chatId,
      sender: user?.id,
      attachments: selectedFiles.map((file) => ({
        type: file.type.split("/")[0],
        name: file.name,
        size: file.size,
      })),
    };

    socketRef.current?.emit("message", message);
    setNewMessage("");
    setSelectedFiles([]);
  };

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    socketRef.current?.emit("message-reaction", {
      messageId,
      emoji,
      userId: user?.id,
    });
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      const response = await axios.get(`/api/messages/search?q=${query}`);
      const results: SearchResult[] = response.data.map((msg: Message) => ({
        id: msg._id,
        title: msg.content,
        type: "message",
      }));
      // Handle search results (e.g., highlight in messages list)
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <ChatContainer>
      <Sidebar>
        <SearchBar onSearch={handleSearch} placeholder="Search messages..." />
        {/* Add chat list here */}
      </Sidebar>
      <ChatArea>
        <MessageList>
          {messages.map((message) => (
            <Message key={message._id} isOwn={message.sender === user?.id}>
              <MessageHeader>
                <MessageSender>{message.sender.name}</MessageSender>
                <MessageTime>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </MessageTime>
                <UserStatus
                  isOnline={message.sender.isOnline}
                  lastSeen={message.sender.lastSeen}
                />
              </MessageHeader>
              <MessageContent isOwn={message.sender === user?.id}>
                {message.content}
                {message.attachments?.map((attachment: any) => (
                  <div key={attachment.name}>
                    {/* Render attachment preview */}
                  </div>
                ))}
                <MessageReactions
                  reactions={message.reactions || []}
                  onAddReaction={(emoji) => handleReaction(message._id, emoji)}
                  onRemoveReaction={(emoji) =>
                    handleReaction(message._id, emoji)
                  }
                  currentUserId={user?.id || ""}
                />
              </MessageContent>
            </Message>
          ))}
          {typingUsers.length > 0 && (
            <TypingIndicator
              username={typingUsers.map((id) => id).join(", ")}
            />
          )}
        </MessageList>
        <MessageInput>
          <FileUpload
            onFilesSelected={handleFileSelect}
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </MessageInput>
      </ChatArea>
    </ChatContainer>
  );
};

export default Chat;
