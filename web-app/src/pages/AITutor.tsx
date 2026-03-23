import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  text: string;
  isAi: boolean;
  timestamp: string;
}

export default function AITutor() {
  const location = useLocation();
  const autoPrompt = location.state?.prompt;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const hasAutoRun = useRef(false);
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const typingIntervalRef = useRef<any>(null);

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /* ===============================
     AUTO SCROLL
  =============================== */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===============================
     LOAD CHAT
  =============================== */

  useEffect(() => {
    const saved = localStorage.getItem("ai_chat_history");

    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          id: Date.now(),
          text: "Hello! I'm your AI Tutor. Ask me anything about NEET MDS.",
          isAi: true,
          timestamp: getTime(),
        },
      ]);
    }
  }, []);

  /* ===============================
     SAVE CHAT
  =============================== */

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ai_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  /* ===============================
     AUTO PROMPT
  =============================== */

  useEffect(() => {

  if (!autoPrompt) return;

  if (messages.length === 0) return;

  if (hasAutoRun.current) return;

  hasAutoRun.current = true;

  sendMessage(autoPrompt);
  navigate("/ai-tutor", { replace: true });

}, [messages]);

  /* ===============================
     SEND MESSAGE
  =============================== */

  async function sendMessage(customText?: string) {
    const text = customText || input;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      isAi: false,
      timestamp: getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await API.post("/ai/tutor/chat", {
        message: text,
      });

      const fullText = response.data.reply;

      const aiMessageId = Date.now() + 1;

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          text: "",
          isAi: true,
          timestamp: getTime(),
        },
      ]);

      let currentIndex = 0;
      const chunkSize = 4;

      typingIntervalRef.current = setInterval(() => {
        currentIndex += chunkSize;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: fullText.slice(0, currentIndex) }
              : msg
          )
        );

        if (currentIndex >= fullText.length) {
          clearInterval(typingIntervalRef.current);
typingIntervalRef.current = null;
          setLoading(false);
        }
      }, 20);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "AI is temporarily unavailable.",
          isAi: true,
          timestamp: getTime(),
        },
      ]);

      setLoading(false);
    }
  }

  function stopGeneration() {
  if (typingIntervalRef.current) {
    clearInterval(typingIntervalRef.current);
    typingIntervalRef.current = null;
    setLoading(false);
  }
}

  return (
    <Layout>

      <div className="max-w-4xl mx-auto flex flex-col h-[80vh] space-y-4">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            AI Tutor
          </h1>
          <p className="text-sm text-slate-500">
            Intelligent NEET MDS Assistant
          </p>
        </div>

        {/* Chat Container */}
        <Card>

          <div className="h-[60vh] overflow-y-auto space-y-4">

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isAi ? "justify-start" : "justify-end"
                }`}
              >
                <div
  className={`max-w-[70%] px-4 py-3 rounded-lg text-sm relative ${
    msg.isAi
      ? "bg-slate-100 text-slate-800"
      : "bg-blue-800 text-white"
  }`}
>

  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {msg.text}
  </ReactMarkdown>


  <div className="text-[10px] opacity-60 mt-1">
    {msg.timestamp}
  </div>
  {msg.isAi && (
    <button
      onClick={() => navigator.clipboard.writeText(msg.text)}
      className="absolute bottom-2 right-2 text-xs bg-black border px-2 py-1 rounded hover:bg-blue-600 text-white"
    >
      Copy
    </button>
  )}

</div>
              </div>
            ))}

            <div ref={chatEndRef} />

            {loading && (
  <div className="flex items-center gap-2 text-sm text-slate-500">

    <div className="flex gap-1">
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
    </div>

    AI is thinking...

  </div>
)}

          </div>

        </Card>

        {/* Input Bar */}
        <div className="flex gap-3 items-center">

          <Input
  value={input}
  onChange={(e: any) => setInput(e.target.value)}
  onKeyDown={(e: any) => {
    if (e.key === "Enter") sendMessage();
  }}
  placeholder="Ask anything about NEET MDS..."
/>

{loading ? (
  <Button
    onClick={stopGeneration}
    className="bg-red-600 hover:bg-red-700"
  >
    Stop
  </Button>
) : (
  <Button onClick={() => sendMessage()}>
    Send
  </Button>
)}

        </div>

      </div>

    </Layout>
  );
}