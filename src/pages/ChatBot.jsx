import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MDEditor from "@uiw/react-md-editor";
import {
  Send,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  Compass,
  Briefcase,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const API_KEY = import.meta.env.VITE_GEMINI_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const SYSTEM_PROMPT = `You are the AI Career Coach at TalentForge Pro.
Your mission is to provide high-impact, actionable, and encouraging career advice, resume optimization, interview prep, and salary negotiation guidance.
Structure your answers with clean markdown headings, bold terms, concise bullet points, and practical action steps. Be empathetic, practical, and highly professional.`;

const PROMPT_SUGGESTIONS = [
  {
    icon: FileCheck,
    title: "Resume Impact",
    prompt: "How can I structure my developer resume with measurable business impact metrics?",
  },
  {
    icon: HelpCircle,
    title: "STAR Interview Prep",
    prompt: "Give me 3 tough behavioral questions for a software engineer and show how to answer using STAR.",
  },
  {
    icon: Compass,
    title: "2026 Tech Skills",
    prompt: "What are the most in-demand technical skills to focus on in 2026 for full-stack developers?",
  },
  {
    icon: Briefcase,
    title: "Salary Negotiation",
    prompt: "What is an effective script to negotiate a higher base salary after receiving an offer?",
  },
];

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "👋 Welcome to **TalentForge AI Career Coach**! I'm here to help you optimize your resume, prep for interviews, evaluate job offers, or plan your next career step. What would you like to explore today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = typeof textToSend === "string" ? textToSend : input;
    if (!query.trim() || loading) return;

    const userMsg = {
      role: "user",
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      if (!genAI || !API_KEY) {
        throw new Error("Gemini API key is not configured.");
      }

      const models = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-2.5-pro", "gemini-1.5-flash"];
      let aiText = "";

      for (const m of models) {
        try {
          const model = genAI.getGenerativeModel({
            model: m,
            systemInstruction: SYSTEM_PROMPT,
          });

          const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: query.trim() }] }],
          });

          if (result?.response?.text()) {
            aiText = result.response.text();
            break;
          }
        } catch (mErr) {
          console.warn(`Model ${m} error:`, mErr.message);
        }
      }

      if (!aiText) throw new Error("No response from AI models.");

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `### Strategic Guidance: ${query.trim()}\n\n* **Demonstrate Measurable Impact**: Always frame your engineering achievements around business metrics (e.g. reduced latency by 35%, increased conversion by 12%).\n* **System Design Depth**: Articulate why you made specific architectural trade-offs.\n* **Collaborative Problem-Solving**: Use the STAR method to show how you resolve blockers cross-functionally.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: "ai",
        text: "Conversation reset. How can I help your career search today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] flex flex-col bg-[var(--color-surface)] rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-[var(--color-text)] flex items-center gap-2">
              AI Career Coach
              <span className="px-2 py-0.5 rounded-[var(--radius-pill)] text-[10px] font-semibold bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                Gemini 3.5
              </span>
            </h1>
            <p className="text-[12px] text-[var(--color-text-muted)]">
              Personalized career guidance & interview preparation
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-[var(--radius-sm)] hover:bg-[var(--color-surface-alt)] transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg, index) => {
          const isAi = msg.role === "ai";
          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${isAi ? "justify-start" : "justify-end"}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`group relative max-w-[90%] sm:max-w-[80%] rounded-[12px] p-4 text-[13.5px] leading-relaxed shadow-xs ${
                  isAi
                    ? "bg-[var(--color-surface-alt)] text-[var(--color-text)] border border-[var(--color-border)]"
                    : "bg-[var(--color-primary-soft)] text-[var(--color-text)] border border-[var(--color-primary)]/20"
                }`}
              >
                {/* Parse Markdown for AI responses */}
                {isAi ? (
                  <div className="chat-markdown prose dark:prose-invert max-w-none">
                    <MDEditor.Markdown
                      source={msg.text}
                      style={{ background: "transparent", color: "inherit" }}
                    />
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}

                {/* Caption timestamp & copy button */}
                <div className="flex items-center justify-between gap-2 mt-2.5 pt-1.5 border-t border-[var(--color-border)] text-[11px] text-[var(--color-text-subtle)]">
                  <span>{msg.time}</span>
                  {isAi && (
                    <button
                      onClick={() => handleCopy(msg.text, index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-[var(--color-text)]"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 text-[var(--color-accent)]" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-full bg-[var(--color-surface-alt)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-[12px] bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-muted)] flex items-center gap-2">
              <div className="w-3 h-3 rounded-full skeleton-shimmer" />
              Thinking with Gemini AI...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length <= 2 && (
        <div className="px-5 py-2 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          <span className="text-[11px] font-semibold text-[var(--color-text-subtle)] flex-shrink-0">
            Suggested:
          </span>
          {PROMPT_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(s.prompt)}
              className="flex items-center gap-1.5 h-7 px-3 rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] border border-[var(--color-border)] text-[12px] text-[var(--color-text-muted)] whitespace-nowrap transition-colors flex-shrink-0 font-medium"
            >
              <s.icon className="w-3 h-3 text-[var(--color-primary)]" />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Sticky Composer */}
      <div className="p-3 sm:p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about resume optimization, interview questions, or negotiation..."
            className="flex-1 h-10 px-3.5 text-[14px] rounded-[var(--radius-pill)] bg-[var(--color-surface-alt)] border border-[var(--color-border)] focus:bg-[var(--color-surface)] focus:border-[var(--color-primary)] outline-none transition-all text-[var(--color-text)] placeholder:text-[var(--color-text-subtle)]"
          />
          <Button
            type="submit"
            disabled={!input.trim() || loading}
            size="default"
            className="h-10 px-4 rounded-[var(--radius-pill)] gap-1.5 font-semibold"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;
