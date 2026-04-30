import "../styles/global.scss";
import "./Coach.scss";
import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import gsap from "gsap";
const Coach = () => {
    const messageRefs = useRef([]);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: " AAAOO MAARAAJ!!!. Aaj excuses nahi chalenge. Kya puchna hai?"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
    
    useEffect(() => {
  if (messageRefs.current.length === 0) return;

  const lastMsg =
    messageRefs.current[messageRefs.current.length - 1];

  if (!lastMsg) return;

  gsap.fromTo(
    lastMsg,
    {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    }
  );
}, [messages]);

  const sendMessage = async (customMsg) => {
    const messageToSend = customMsg || input;
    if (!messageToSend.trim()) return;

    const userMsg = { type: "user", text: messageToSend };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      setLoading(true);

      const res = await api.post("/api/ai/ask", {
        message: messageToSend
      });

      const botMsg = {
        type: "bot",
        text: res.data.reply
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: " Server busy hai... par sun — discipline la warna kuch nahi hoga!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coach-page">
     
      <div className="coach-header">
        <h2>AI Fitness Coach</h2>
        <p>Your personal fitness trainer</p>
      </div>

   
      <div className="chat-container">
        {messages.map((msg, i) => (
     <div
  key={i}
  ref={(el) => (messageRefs.current[i] = el)}
  className={`message-row ${msg.type}`}
>
  <div className={`chat-bubble ${msg.type}`}>
    {msg.text.split("\n").map((line, idx) => (
      <div key={idx}>{line}</div>
    ))}
  </div>
</div>
        ))}

       
        {loading && (
          <div className="message-row bot">
            <div className="chat-bubble bot typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef}></div>
      </div>

      {/* QUICK PROMPTS */}
      <div className="quick-prompts">
        <button onClick={() => sendMessage("Optimize my macros")}>
          Optimize macros
        </button>
        <button onClick={() => sendMessage("Should I rest today?")}>
          Rest day?
        </button>
        <button onClick={() => sendMessage("How to get abs faster?")}>
          Get abs
        </button>
      </div>

      {/* INPUT */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask your coach..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button onClick={() => sendMessage()} disabled={loading}>
          ➤
        </button>
        
      </div>
        
      
        <footer className="coach-footer">
          <p>  RIGHTS RESERVED BY HIMANSHU</p>
          <div className="footer-links">
            <a href="#">PRIVACY POLICY</a>
            <a href="#">SUPPORT</a>
            <a
  href="https://www.instagram.com/himaanshushaarma?igsh=MW9idjJpODZ2dmpxeg=="
  target="_blank"
  rel="noopener noreferrer"
  className="support-link"
>
  CONTACT
</a>
          </div>
        </footer>

      
    </div>
  );
};

export default Coach;