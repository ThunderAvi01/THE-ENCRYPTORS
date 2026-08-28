"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, CheckCheck, User, Stethoscope, FileText, Image as ImageIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface ChatMessageItem {
  _id: string;
  senderId: string;
  senderRole: "PATIENT" | "DOCTOR";
  text: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
  }>;
  read: boolean;
  createdAt: string;
}

interface DoctorPatientChatWidgetProps {
  targetUserId: string;
  targetUserName: string;
  targetRole: "DOCTOR" | "PATIENT";
  currentUserId: string;
}

export function DoctorPatientChatWidget({
  targetUserId,
  targetUserName,
  targetRole,
  currentUserId,
}: DoctorPatientChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/messages?targetUserId=${targetUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // 4s polling fallback for real-time sync
    return () => clearInterval(interval);
  }, [targetUserId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !attachmentUrl) return;

    setIsSending(true);
    try {
      const attachments = attachmentUrl
        ? [{ fileName: "Attachment.png", fileUrl: attachmentUrl, fileType: "IMAGE" }]
        : [];

      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: targetUserId,
          text: inputText.trim(),
          attachments,
        }),
      });

      if (res.ok) {
        setInputText("");
        setAttachmentUrl("");
        fetchMessages();
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const unreadCount = messages.filter((m) => m.senderId === targetUserId && !m.read).length;

  return (
    <Card className="border-border flex flex-col h-[520px] max-w-2xl mx-auto shadow-md">
      {/* Header */}
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white font-bold shadow-sm">
              {targetRole === "DOCTOR" ? <Stethoscope className="h-5 w-5" /> : <User className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-sm font-bold">{targetUserName}</CardTitle>
              <span className="text-[10px] text-muted-foreground font-semibold">
                Secure Doctor-Patient Channel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && <Badge variant="warning">{unreadCount} New</Badge>}
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchMessages}
              className="h-7 w-7 p-0"
              title="Refresh messages"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages Feed */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-card">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
            No messages yet. Send a message to start conversation.
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUserId;
            return (
              <div
                key={m._id}
                className={`flex gap-2.5 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs space-y-1.5 shadow-sm ${
                    isMe
                      ? "bg-teal-600 text-white rounded-tr-none"
                      : "bg-muted/40 border border-border text-foreground rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed font-medium">{m.text}</p>

                  {m.attachments && m.attachments.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {m.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 p-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-[11px] font-bold underline"
                        >
                          <FileText className="h-3.5 w-3.5 shrink-0" />
                          <span>{att.fileName}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-75">
                    <span>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {isMe && <CheckCheck className={`h-3 w-3 ${m.read ? "text-cyan-200" : ""}`} />}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </CardContent>

      {/* Input Area */}
      <div className="p-3 border-t border-border bg-card space-y-2">
        {attachmentUrl && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 text-xs border border-border">
            <span className="font-semibold text-teal-600 truncate">Attachment added</span>
            <button
              type="button"
              onClick={() => setAttachmentUrl("")}
              className="text-rose-500 font-bold hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const url = prompt("Enter Image/Document URL:");
              if (url) setAttachmentUrl(url);
            }}
            className="h-9 w-9 p-0 border-border"
            title="Attach Document"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </Button>

          <Button
            variant="clinical"
            size="sm"
            onClick={handleSendMessage}
            disabled={isSending || (!inputText.trim() && !attachmentUrl)}
            className="gap-1 text-xs font-bold h-9"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
