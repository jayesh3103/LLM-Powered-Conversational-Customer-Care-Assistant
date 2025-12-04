"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "react-feather";
import LoadingDots from "@/components/LoadingDots";
import Nav from "@/components/Navbar";

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content:
        "Hello! Ask me any product details or recommendations",
    },
  ]);
  const my_arr = useRef([]);

  const lastMessageRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    my_arr.current.push(message);

    if (message == "") return;
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: message },
    ]);
    setMessage("");
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    try {
      const response = await fetch(`${apiUrl}/product-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: message, history: history }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      setHistory((oldHistory) => [
        ...oldHistory,
        { role: "assistant", content: "" },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        answer += chunk;
        
        setHistory((oldHistory) => {
          const newHistory = [...oldHistory];
          newHistory[newHistory.length - 1].content = answer;
          return newHistory;
        });
      }
      
      my_arr.current.push(answer);
      setLoading(false);

    } catch (err) {
      alert(err);
      setLoading(false);
    }
  }


  const formatPageName = (url) => {
    // Split the URL by "/" and get the last segment
    const pageName = url.split("/").pop();

    // Split by "-" and then join with space
    if (pageName) {
      const formattedName = pageName.split("-").join(" ");

      // Capitalize only the first letter of the entire string
      return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
    }
  };

  //scroll to bottom of chat
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  return (
    <main className="h-screen w-full flex flex-col overflow-hidden">
      <Nav/>
      <div className="flex flex-col gap-8 w-full items-center flex-grow max-h-full px-4 sm:px-8 pb-4">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-violet to-neon-cyan drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
            Product Details Chat 
        </h1>
        <div className="glass-panel rounded-2xl w-full lg:w-3/4 flex-grow flex flex-col overflow-hidden relative">
          <div className="overflow-y-auto flex flex-col gap-6 p-6 sm:p-10 h-full custom-scrollbar pb-32">
            {history.map((message, idx) => {
              const isLastMessage = idx === history.length - 1;

              switch (message.role) {
                case "assistant":
                  return (
                    <div
                      ref={isLastMessage ? lastMessageRef : null}
                      key={idx}
                      className="flex gap-4 items-start"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-neon-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex-shrink-0">
                        <img
                            src="images/assistant-avatar.png"
                            className="w-full h-full object-cover"
                            alt="AI"
                        />
                      </div>
                      <div className="w-auto max-w-xl break-words glass-panel bg-white/5 border-white/10 rounded-2xl rounded-tl-none text-gray-100 p-6 shadow-lg">
                        <p className="text-xs font-bold text-neon-cyan mb-2 uppercase tracking-wider">
                          AI Assistant
                        </p>
                        <div className="text-sm leading-relaxed text-gray-200">
                            {message.content}
                        </div>
                        {message.links && (
                          <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-white/10">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              Sources:
                            </p>

                            {message.links?.map((link) => {
                              return (

                                <a
                                  href={link}
                                  key={link}
                                  className="block w-fit px-3 py-1.5 text-xs font-medium text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20 rounded-full hover:bg-neon-cyan/20 transition-colors"
                                >
                                  {formatPageName(link)}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                case "user":
                  return (
                    <div
                      className="flex gap-4 items-start flex-row-reverse self-end"
                      key={idx}
                      ref={isLastMessage ? lastMessageRef : null}
                    >
                       <div className="w-10 h-10 rounded-full overflow-hidden border border-neon-violet/50 shadow-[0_0_10px_rgba(139,92,246,0.3)] flex-shrink-0">
                        <img
                            src="images/user.jpeg"
                            className="w-full h-full object-cover"
                            alt="User"
                        />
                      </div>
                      <div className="w-auto max-w-xl break-words bg-gradient-to-br from-neon-violet/20 to-fuchsia-600/20 border border-neon-violet/30 rounded-2xl rounded-tr-none text-white p-6 shadow-lg backdrop-blur-md">
                        <p className="text-xs font-bold text-neon-violet mb-2 uppercase tracking-wider text-right">
                          You
                        </p>
                        <div className="text-sm leading-relaxed">
                            {message.content}
                        </div>
                      </div>
                    </div>
                  );
              }
            })}
            {loading && (
              <div ref={lastMessageRef} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-neon-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex-shrink-0">
                    <img
                        src="images/assistant-avatar.png"
                        className="w-full h-full object-cover"
                        alt="AI"
                    />
                </div>
                <div className="w-auto max-w-xl break-words glass-panel bg-white/5 border-white/10 rounded-2xl rounded-tl-none text-gray-100 p-6 shadow-lg">
                  <p className="text-xs font-bold text-neon-cyan mb-4 uppercase tracking-wider">
                    AI Assistant
                  </p>
                  <LoadingDots />
                </div>
              </div>
            )}
          </div>

          {/* input area */}
          <div className="absolute bottom-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-black/80 to-transparent">
            <form 
                className="w-full relative flex items-center gap-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleClick();
                }}
            >
              <div className="relative w-full group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-violet to-neon-cyan rounded-full opacity-30 group-hover:opacity-75 transition duration-500 blur"></div>
                  <input
                    aria-label="chat input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="relative w-full bg-black/50 text-white placeholder-gray-400 border border-white/10 rounded-full py-4 pl-6 pr-16 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 backdrop-blur-xl transition-all"
                  />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-neon-violet text-white hover:bg-fuchsia-600 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.8)] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    aria-label="Send"
                    disabled={!message || loading}
                  >
                    <Send size={18} />
                  </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
