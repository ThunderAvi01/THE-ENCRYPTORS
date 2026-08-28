"use client";

import React, { useState } from "react";
import { Bot, Send, User, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  sender: "AI" | "PATIENT";
  text: string;
  timestamp: string;
}

export function AIAssistantChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "AI",
      text: "Namaste! I am your clinical intake assistant. Can you describe what discomfort or symptoms you are experiencing today?",
      timestamp: "10:00 AM",
    },
    {
      id: "2",
      sender: "PATIENT",
      text: "I have had a throbbing pain in my upper abdomen for the past 3 days, especially after dinner.",
      timestamp: "10:01 AM",
    },
    {
      id: "3",
      sender: "AI",
      text: "Thank you for specifying. Does this pain radiate to your back or shoulders, and have you noticed any accompanying nausea, acidity, or fever?",
      timestamp: "10:01 AM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "PATIENT",
      text: inputValue,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");

    // Simulate AI clinical intake turn
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "AI",
          text: "Recorded. Are you currently taking any regular medications or antacids for this discomfort?",
          timestamp: "Just now",
        },
      ]);
    }, 600);
  };

  return (
    <div className="flex flex-col h-[420px] rounded-xl border border-border/80 bg-card overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">AI History Intake Assistant</h4>
              <Badge variant="clinical" className="text-[10px] py-0">Agnostic Provider</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">Structured Questioning • Zero Autonomous Prescriptions</p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950/20">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${
              m.sender === "PATIENT" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                m.sender === "PATIENT"
                  ? "bg-slate-800 text-white"
                  : "bg-teal-600 text-white"
              }`}
            >
              {m.sender === "PATIENT" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                m.sender === "PATIENT"
                  ? "bg-teal-700 text-white rounded-tr-none"
                  : "bg-card border border-border text-foreground rounded-tl-none"
              }`}
            >
              <p>{m.text}</p>
              <span
                className={`mt-1 block text-[10px] ${
                  m.sender === "PATIENT" ? "text-teal-200" : "text-muted-foreground"
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-border bg-card flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Describe symptoms, duration, triggers..."
          className="text-xs sm:text-sm"
        />
        <Button type="submit" variant="clinical" size="sm" className="gap-1">
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Send</span>
        </Button>
      </form>
    </div>
  );
}
