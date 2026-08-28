"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  Info,
  Volume2,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AIQuestionResponse } from "@/types/ai";
import { AyushSystem } from "@/types/user";
import { VoiceInputController } from "./VoiceInputController";
import { AudioPlayerWidget } from "./AudioPlayerWidget";
import { LanguageSelector } from "./LanguageSelector";
import { EmergencyRedFlagModal } from "@/components/safety/EmergencyRedFlagModal";
import { evaluateSafetyStatus } from "@/services/safety/safetyEngine";
import { getTranslations } from "@/lib/i18n/translations";

interface MessageItem {
  id: string;
  sender: "AI" | "PATIENT";
  text: string;
  timestamp: string;
  extractedKeys?: string[];
  language?: string;
}

interface AIDialogueWidgetProps {
  sessionId?: string;
  answers: Record<string, unknown>;
  onUpdateAnswers: (newAnswers: Record<string, unknown>) => void;
  selectedAyushSystem: AyushSystem;
  selectedLanguage: string;
  onSelectLanguage?: (lang: string) => void;
  onSwitchToWizard?: () => void;
}

export function AIDialogueWidget({
  answers,
  onUpdateAnswers,
  selectedAyushSystem,
  selectedLanguage,
  onSelectLanguage,
  onSwitchToWizard,
}: AIDialogueWidgetProps) {
  const t = getTranslations(selectedLanguage);

  const initialGreetingByLang: Record<string, string> = {
    en: "Hello! I am your AI Clinical Intake Assistant. What primary symptom or health discomfort brings you to the clinic today?",
    hi: "नमस्ते! मैं आपका एआई क्लिनिकल असिस्टेंट हूँ। आज आपको क्या मुख्य स्वास्थ्य समस्या या दर्द महसूस हो रहा है?",
    bn: "নমস্কার! আমি আপনার AI ক্লিনিক্যাল অ্যাসিস্ট্যান্ট। আজ আপনার কী প্রধান স্বাস্থ্য সমস্যা বা কষ্ট হচ্ছে?",
  };

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-1",
      sender: "AI",
      text: initialGreetingByLang[selectedLanguage] || initialGreetingByLang.en,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      language: selectedLanguage,
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingVal, setEditingVal] = useState("");
  const [showVoiceController, setShowVoiceController] = useState(true);
  const [urgentModalOpen, setUrgentModalOpen] = useState(false);
  const [urgentReason, setUrgentReason] = useState("");

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputVal).trim();
    if (!textToSend) return;

    const userMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "PATIENT",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      language: selectedLanguage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsLoading(true);

    // PHASE 8: Deterministic Safety Engine Check
    const safetyEval = evaluateSafetyStatus({
      patientInput: textToSend,
      answers,
    });

    if (safetyEval.isUrgent) {
      setUrgentReason(safetyEval.triageAlertReason);
      setUrgentModalOpen(true);
    } else if (safetyEval.isWarning) {
      setRedFlags((prev) => Array.from(new Set([...prev, safetyEval.triageAlertReason])));
    }

    try {
      const res = await fetch("/api/clinical/ai-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientInput: textToSend,
          answersMap: answers,
          selectedAyushSystem,
          selectedLanguage,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const aiData: AIQuestionResponse = result.data;

        // Update collected answers
        if (aiData.collectedInformation && Object.keys(aiData.collectedInformation).length > 0) {
          onUpdateAnswers({
            ...answers,
            ...aiData.collectedInformation,
          });
        }

        // Check red flags
        if (aiData.possibleRedFlags && aiData.possibleRedFlags.length > 0) {
          setRedFlags(aiData.possibleRedFlags);
        }

        // Add AI response
        const aiMsg: MessageItem = {
          id: `msg-ai-${Date.now()}`,
          sender: "AI",
          text: aiData.nextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          extractedKeys: Object.keys(aiData.collectedInformation || {}),
          language: selectedLanguage,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (err) {
      console.error("AI Dialogue Widget Error:", err);
      // Multilingual fallback messages
      const fallbacks: Record<string, string> = {
        en: "Thank you. How long have you experienced this discomfort and how severe is it on a 1 to 10 scale?",
        hi: "धन्यवाद। आपको यह समस्या कितने समय से है और 1 से 10 के पैमाने पर दर्द कितना तेज है?",
        bn: "ধন্যবাদ। আপনি কতদিন ধরে এই সমস্যায় ভুগছেন এবং ১ থেকে ১০ স্কেলে কষ্ট কতটা বেশি?",
      };

      const fallbackMsg: MessageItem = {
        id: `msg-fallback-${Date.now()}`,
        sender: "AI",
        text: fallbacks[selectedLanguage] || fallbacks.en,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        language: selectedLanguage,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = (key: string) => {
    onUpdateAnswers({
      ...answers,
      [key]: editingVal,
    });
    setEditingKey(null);
    setEditingVal("");
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* PHASE 8: EMERGENCY RED FLAG MODAL */}
      <EmergencyRedFlagModal
        isOpen={urgentModalOpen}
        alertReason={urgentReason}
        onAcknowledgeEmergency={() => setUrgentModalOpen(false)}
      />

      {/* MANDATORY DISCLAIMER BANNER */}
      <div className="p-3.5 rounded-xl border border-teal-500/30 bg-teal-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-teal-600 shrink-0" />
          <span className="font-bold text-foreground">
            {t.aiDisclaimer}
          </span>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {onSelectLanguage && (
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onSelectLanguage={onSelectLanguage}
              compact
            />
          )}
          {onSwitchToWizard && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSwitchToWizard}
              className="text-[11px] h-7 border-teal-500/30 shrink-0"
            >
              {t.formWizardMode}
            </Button>
          )}
        </div>
      </div>

      {/* Red-Flag Alert Warning */}
      {redFlags.length > 0 && (
        <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs space-y-1 text-rose-950 dark:text-rose-200">
          <div className="flex items-center gap-2 font-bold text-rose-600">
            <AlertTriangle className="h-4 w-4 animate-pulse" />
            <span>Possible Emergency Triage Flag Detected</span>
          </div>
          <p className="text-[11px]">
            Flags: {redFlags.join(", ")}. If you are experiencing sudden severe chest pain, extreme breathlessness, or heavy bleeding, please visit the emergency room immediately.
          </p>
        </div>
      )}

      {/* Grid: Chat Conversation & Collected Data Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Feed */}
        <Card className="border-border lg:col-span-2 flex flex-col h-[580px]">
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
                  <Bot className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-bold">{t.aiDialogueMode}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="clinical">{selectedAyushSystem}</Badge>
                <Badge variant="outline" className="uppercase text-[10px]">
                  {selectedLanguage}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[88%] ${
                  m.sender === "PATIENT" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                    m.sender === "PATIENT"
                      ? "bg-cyan-600 text-white"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {m.sender === "PATIENT" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div
                    className={`p-3 rounded-2xl text-xs space-y-1 ${
                      m.sender === "PATIENT"
                        ? "bg-teal-600 text-white rounded-tr-none"
                        : "bg-muted/40 border border-border text-foreground rounded-tl-none"
                    }`}
                  >
                    <p className="leading-relaxed font-medium">{m.text}</p>
                    <span className="text-[9px] opacity-70 block text-right">{m.timestamp}</span>
                  </div>

                  {/* Voice Audio Speaker Icon for AI Questions */}
                  {m.sender === "AI" && (
                    <div className="pt-0.5">
                      <AudioPlayerWidget
                        textToSpeak={m.text}
                        language={m.language || selectedLanguage}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-600" />
                <span>AI Clinical Assistant is processing in {selectedLanguage.toUpperCase()}...</span>
              </div>
            )}
          </CardContent>

          {/* Multimodal Voice & Text Input Section */}
          <div className="p-3 border-t border-border bg-card space-y-3">
            {/* Toggle Mic Controller vs Text Box */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {t.speakYourResponse} / {t.orTypeText}
              </span>
              <button
                type="button"
                onClick={() => setShowVoiceController(!showVoiceController)}
                className="text-[11px] text-muted-foreground hover:text-teal-600 underline font-medium"
              >
                {showVoiceController ? "Hide Mic Panel" : "Show Mic Panel"}
              </button>
            </div>

            {/* Voice Microphone Controller */}
            {showVoiceController && (
              <VoiceInputController
                language={selectedLanguage}
                onSendTranscript={(transcriptText) => handleSendMessage(transcriptText)}
                disabled={isLoading}
              />
            )}

            {/* Text Typing Input Fallback */}
            <div className="flex gap-2">
              <input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={t.orTypeText}
                className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
              <Button
                variant="clinical"
                size="sm"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputVal.trim()}
                className="gap-1 text-xs font-bold"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Extracted Clinical History Summary Drawer */}
        <Card className="border-border lg:col-span-1 flex flex-col h-[580px]">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Extracted Clinical History
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {Object.keys(answers).length === 0 ? (
              <p className="text-muted-foreground text-[11px] italic">
                No information extracted yet. Answer questions via voice or text to build your clinical record.
              </p>
            ) : (
              Object.entries(answers).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-600 text-[10px] uppercase tracking-wider">
                      {k.replace("_", " ")}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingKey(k);
                        setEditingVal(String(v));
                      }}
                      className="text-muted-foreground hover:text-teal-600"
                    >
                      <Edit3 className="h-3 w-3" />
                    </button>
                  </div>

                  {editingKey === k ? (
                    <div className="flex gap-1 pt-1">
                      <input
                        value={editingVal}
                        onChange={(e) => setEditingVal(e.target.value)}
                        className="flex-1 rounded border border-input px-2 py-0.5 text-xs"
                      />
                      <Button variant="clinical" size="sm" onClick={() => handleSaveEdit(k)} className="h-6 px-2 text-[10px]">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <p className="text-foreground font-medium truncate">
                      {Array.isArray(v) ? v.join(", ") : String(v)}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
