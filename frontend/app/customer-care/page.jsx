"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "react-feather";
import LoadingDots from "@/components/LoadingDots";
import Nav from "@/components/Navbar";
import { GLOBAL_VARIABLE_SATISFIED } from '@/../config';
import { GLOBAL_VARIABLE_NOT_SATISFIED } from '@/../config';

export default function Home() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content:
        "Hello! You can ask me anything related to laptop troubleshooting. I'm here to help!",
    },
  ]);
  const lastMessageRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const my_arr = useRef([]);


  const handleClick = () => {
    my_arr.current.push(message);
    if (message == "") return;
    setHistory((oldHistory) => [
      ...oldHistory,
      { role: "user", content: message },
    ]);
    setMessage("");
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    fetch(`${apiUrl}/customer-service`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: message, history: history }),
})
  .then(async (res) => {
    const r = await res.json();
    console.log(r.answer);
    my_arr.current.push(r.answer);

    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "assistant",
        content: r.answer,
      },
    ]);
    setLoading(false);
  })
  .catch((err) => {
    alert(err);
  });
  }
  const handleClickSatisfied = () => {
    GLOBAL_VARIABLE_SATISFIED.push(my_arr.current);

    console.log(GLOBAL_VARIABLE_SATISFIED);
  }

  const handleClickUnsatisfied = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
    fetch(`${apiUrl}/escalate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: history }),
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Request escalated");
        GLOBAL_VARIABLE_NOT_SATISFIED.push(my_arr.current);
    })
    .catch(err => alert("Failed to escalate: " + err));
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
          Customer Care Chat
        </h1>
        <div className="glass-panel rounded-2xl w-full lg:w-3/4 flex-grow flex flex-col overflow-hidden relative">
          <div className="overflow-y-auto flex flex-col gap-6 p-6 sm:p-10 h-full custom-scrollbar pb-40">
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
          <div className="absolute bottom-0 w-full px-6 pb-6 pt-10 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-4">
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
            <div className="flex gap-4 w-full justify-center">
                <a href="/dashboard">
                    <button onClick={handleClickUnsatisfied} className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                    I want to talk to a human!!
                    </button>
                </a>
                <button onClick={handleClickSatisfied} className="px-6 py-2.5 rounded-full text-sm font-medium text-white bg-green-500/10 border border-green-500/50 hover:bg-green-500 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]">
                    End Chat
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
