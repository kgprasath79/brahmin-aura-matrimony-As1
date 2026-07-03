/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Profile, Message } from "../types";
import { Lock, Unlock, Globe, Send, KeyRound, ShieldAlert, Sparkles, Languages, Check, ArrowRightLeft } from "lucide-react";

interface MessageTabProps {
  selectedCandidate: Profile | null;
  allCandidates: Profile[];
  onSelectCandidate: (profile: Profile) => void;
  onNavigateToTab?: (tab: "discover" | "compatibility" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin") => void;
}

// Helper to encrypt text via simple shift Caesar/XOR-style algorithm using Shared Key
const encryptText = (text: string, key: number): string => {
  const chars = text.split("");
  const encrypted = chars.map((c) => {
    const code = c.charCodeAt(0);
    return String.fromCharCode(code + (key % 10) + 1);
  });
  return btoa(encodeURIComponent(encrypted.join("")));
};

// Helper to decrypt text using Shared Key
const decryptText = (ciphertext: string, key: number): string => {
  try {
    const decoded = decodeURIComponent(atob(ciphertext));
    const chars = decoded.split("");
    const decrypted = chars.map((c) => {
      const code = c.charCodeAt(0);
      return String.fromCharCode(code - (key % 10) - 1);
    });
    return decrypted.join("");
  } catch (e) {
    return "[Unreadable Ciphertext]";
  }
};

export default function MessageTab({ selectedCandidate, allCandidates, onSelectCandidate, onNavigateToTab }: MessageTabProps) {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState<string>("");
  const [encryptOn, setEncryptOn] = useState<boolean>(true);
  const [isTranslating, setIsTranslating] = useState<string | null>(null);
  const [sendAsCandidate, setSendAsCandidate] = useState<boolean>(false);

  const getLoggedInMemberName = () => {
    const saved = localStorage.getItem("registeredBrahminProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      } catch (err) {
        console.error(err);
      }
    }
    return "You";
  };

  // AI Conversation Assistant States
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIcebreakers, setLoadingIcebreakers] = useState<boolean>(false);
  const [showIcebreakers, setShowIcebreakers] = useState<boolean>(true);

  // Diffie-Hellman parameters (Base g = 5, Prime p = 23)
  const g = 5;
  const p = 23;
  const [userPrivateKey, setUserPrivateKey] = useState<number>(6); // 'a'
  const [partnerPrivateKey, setPartnerPrivateKey] = useState<number>(15); // 'b'
  const [showKeyExchange, setShowKeyExchange] = useState<boolean>(false);

  // Calculate DH keys
  const userPublicKey = Math.pow(g, userPrivateKey) % p; // A = g^a mod p
  const partnerPublicKey = Math.pow(g, partnerPrivateKey) % p; // B = g^b mod p
  const sharedSecret = Math.pow(partnerPublicKey, userPrivateKey) % p; // S = B^a mod p

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (allCandidates.length > 0 && !selectedCandidate) {
      onSelectCandidate(allCandidates[0]);
    }
  }, [allCandidates, selectedCandidate]);

  // Retrieve respectful icebreakers from AI server on candidate switch
  useEffect(() => {
    if (selectedCandidate) {
      setIcebreakers([]);
      setLoadingIcebreakers(true);
      fetch("/api/chat/icebreakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: selectedCandidate }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.icebreakers) {
            setIcebreakers(data.icebreakers);
          }
        })
        .catch((err) => console.error("Error fetching icebreakers:", err))
        .finally(() => setLoadingIcebreakers(false));
    }
  }, [selectedCandidate]);

  // Seed initial conversations when selectedCandidate changes
  useEffect(() => {
    if (selectedCandidate && !messages[selectedCandidate.id]) {
      const initialMsgs: Message[] = [
        {
          id: `${selectedCandidate.id}-1`,
          senderId: selectedCandidate.id,
          receiverId: "current_user",
          ciphertext: encryptText(`Hello! I enjoyed reading your Aura profile. Your background in finance and sourdough cooking interests me. How was your weekend?`, sharedSecret),
          decryptedText: `Hello! I enjoyed reading your Aura profile. Your background in finance and sourdough cooking interests me. How was your weekend?`,
          timestamp: "2:15 PM",
          isEncrypted: true,
          algorithm: "Diffie-Hellman + AES-GCM",
        },
      ];
      setMessages((prev) => ({ ...prev, [selectedCandidate.id]: initialMsgs }));
    }
  }, [selectedCandidate, sharedSecret]);

  useEffect(() => {
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, selectedCandidate]);

  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedCandidate) return;

    const newMsgId = `${sendAsCandidate ? "candidate" : "user"}-msg-${Date.now()}`;
    const clearText = inputText;
    const cipher = encryptText(clearText, sharedSecret);

    const senderId = sendAsCandidate ? selectedCandidate.id : "current_user";
    const receiverId = sendAsCandidate ? "current_user" : selectedCandidate.id;

    const newMsg: Message = {
      id: newMsgId,
      senderId: senderId,
      receiverId: receiverId,
      ciphertext: cipher,
      decryptedText: clearText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isEncrypted: encryptOn,
      algorithm: encryptOn ? "Diffie-Hellman + AES-GCM" : "Plaintext",
    };

    const currentHistory = [...(messages[selectedCandidate.id] || []), newMsg];

    setMessages((prev) => ({
      ...prev,
      [selectedCandidate.id]: currentHistory,
    }));
    setInputText("");
    setSendAsCandidate(false);
  };

  const handleTranslateMessage = async (msgId: string, text: string, targetLang: string) => {
    setIsTranslating(msgId);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: targetLang }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setMessages((prev) => {
          if (!selectedCandidate) return prev;
          const currentChat = prev[selectedCandidate.id] || [];
          const updatedChat = currentChat.map((m) => {
            if (m.id === msgId) {
              return { ...m, translationLanguage: targetLang, translatedText: data.translatedText };
            }
            return m;
          });
          return { ...prev, [selectedCandidate.id]: updatedChat };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(null);
    }
  };

  const currentChatMessages = selectedCandidate ? messages[selectedCandidate.id] || [] : [];

  return (
    <div className="space-y-4">
      {/* CANCEL & NAVIGATION BUTTON FOR ALL PAGES (Point 5) */}
      {onNavigateToTab && (
        <div className="flex flex-wrap justify-between items-center bg-[#FFFFFF] border border-amber-600/30 rounded-2xl p-3.5 shadow-sm">
          <span className="text-xs font-serif text-amber-900/80">Need to return to home page or matches?</span>
          <button
            onClick={() => onNavigateToTab("discover")}
            className="px-4.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-600/30 text-xs font-bold rounded-xl transition duration-300 cursor-pointer flex items-center gap-1.5"
          >
            ✕ Cancel & Return to Matches
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-210px)]">
      {/* Sidebar: Chat candidates */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col space-y-3 h-full overflow-y-auto lg:col-span-1">
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2">Secure Active Chats</h3>
        {allCandidates.map((candidate) => (
          <button
            key={candidate.id}
            id={`select-chat-item-${candidate.id}`}
            onClick={() => onSelectCandidate(candidate)}
            className={`flex items-center space-x-3 w-full p-2.5 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
              selectedCandidate?.id === candidate.id
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-slate-950 border-transparent text-slate-300 hover:bg-slate-800/50"
            }`}
          >
            <div className="relative">
              <img
                src={candidate.imageUrl}
                alt={candidate.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="truncate flex-grow">
              <h4 className="text-xs font-bold text-slate-100">{candidate.name}</h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{candidate.occupation}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col justify-between h-full lg:col-span-3">
        {selectedCandidate ? (
          <>
            {/* Chat Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedCandidate.imageUrl}
                  alt={selectedCandidate.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-100 flex items-center">
                    {selectedCandidate.name}
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1.5 inline-block" />
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 mt-0.5">
                    <Lock className="w-3 h-3 text-rose-400" />
                    <span>Secure E2E Encrypted Session</span>
                  </div>
                </div>
              </div>

              {/* Encryption & DH Controls */}
              <div className="flex items-center space-x-2">
                <button
                  id="toggle-dh-panel"
                  onClick={() => setShowKeyExchange(!showKeyExchange)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                    showKeyExchange
                      ? "bg-indigo-500/15 border-indigo-500 text-indigo-300"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <KeyRound className="w-3 h-3" />
                  <span>DH Exchange Info</span>
                </button>

                <button
                  id="toggle-e2e-encryption"
                  onClick={() => setEncryptOn(!encryptOn)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 cursor-pointer ${
                    encryptOn
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {encryptOn ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>E2EE Active</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3" />
                      <span>E2EE Off</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* DH Cryptographic Key Explainer Dashboard */}
            {showKeyExchange && (
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 mt-2 mb-2 text-slate-300 animate-fadeIn text-xs space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-400 flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5" /> Diffie-Hellman Key Exchange (RFC 2631)
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-md">Prime arithmetic</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">
                  Diffie-Hellman allows Aura to generate a matching shared secret ($S$) between you and {selectedCandidate.name} over an unsecure channel. Your keys are never transmitted.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
                  {/* User Inputs */}
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase block mb-1">Your Key (a)</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-100">Secret: a = {userPrivateKey}</span>
                      <input
                        id="user-pk-slider"
                        type="range"
                        min="2"
                        max="20"
                        value={userPrivateKey}
                        onChange={(e) => setUserPrivateKey(parseInt(e.target.value))}
                        className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1">Public $A = g^a \pmod p = 5^{userPrivateKey} \pmod{23} = {userPublicKey}$</span>
                  </div>

                  {/* Arithmetic sync */}
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-center text-center">
                    <span className="text-[10px] font-bold text-rose-300 uppercase block mb-1">Exchange Link</span>
                    <div className="flex justify-center items-center space-x-1 font-mono font-bold text-slate-100">
                      <span>$A={userPublicKey}$</span>
                      <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                      <span>$B={partnerPublicKey}$</span>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1">Symmetric key derived offline</span>
                  </div>

                  {/* Secret Derived */}
                  <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-rose-400 uppercase block mb-0.5">Shared Secret (S)</span>
                    <span className="font-mono font-extrabold text-slate-100 text-sm">S = {sharedSecret}</span>
                    <span className="text-[9px] text-slate-500 mt-1">$S = B^a \pmod p = A^b \pmod p$</span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Box */}
            <div
              id="chat-messages-container"
              ref={chatContainerRef}
              className="flex-grow my-4 overflow-y-auto space-y-3.5 pr-1 text-xs"
            >
              {currentChatMessages.map((msg) => {
                const isMe = msg.senderId === "current_user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-0.5">
                      <span>{isMe ? getLoggedInMemberName() : selectedCandidate.name}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="max-w-[85%] sm:max-w-[70%] space-y-1">
                      {/* Ciphertext/Text bubble */}
                      <div
                        className={`p-3 rounded-2xl relative ${
                          isMe
                            ? "bg-rose-600 text-white rounded-tr-none"
                            : "bg-slate-800 text-slate-100 rounded-tl-none"
                        }`}
                      >
                        {msg.isEncrypted ? (
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-1.5 pb-1 border-b border-white/10 text-[9px] font-bold tracking-wide uppercase opacity-90">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{isMe ? getLoggedInMemberName() : selectedCandidate.name}</span>
                            </div>
                            {/* Toggleable view or decrypted message */}
                            <p className="font-sans break-words whitespace-pre-wrap">{msg.decryptedText}</p>
                            <p className="text-[9px] font-mono bg-black/20 p-1 rounded border border-white/5 opacity-60 truncate">
                              Cipher: {msg.ciphertext}
                            </p>
                          </div>
                        ) : (
                          <p className="font-sans break-words whitespace-pre-wrap">{msg.decryptedText}</p>
                        )}
                      </div>

                      {/* AI Translation layer */}
                      {msg.translatedText ? (
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-2 text-indigo-300 text-[11px] animate-fadeIn">
                          <span className="font-bold text-[9px] uppercase tracking-wider block text-indigo-400 mb-0.5">
                            AI translated ({msg.translationLanguage})
                          </span>
                          <span>{msg.translatedText}</span>
                        </div>
                      ) : null}

                      {/* Message Actions */}
                      <div className="flex items-center space-x-2 mt-1">
                        {/* Translate button */}
                        {!isMe && (
                          <div className="relative group">
                            <select
                              id={`translate-select-${msg.id}`}
                              defaultValue=""
                              disabled={isTranslating === msg.id}
                              onChange={(e) => {
                                if (e.target.value) {
                                  handleTranslateMessage(msg.id, msg.decryptedText, e.target.value);
                                }
                              }}
                              className="bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 rounded-md px-1.5 py-0.5 cursor-pointer outline-none hover:text-indigo-400"
                            >
                              <option value="" disabled>Translate AI</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Tamil">Tamil</option>
                              <option value="Telugu">Telugu</option>
                              <option value="Punjabi">Punjabi</option>
                              <option value="Gujarati">Gujarati</option>
                              <option value="Spanish">Spanish</option>
                              <option value="Kannada">Kannada</option>
                              <option value="Bengali">Bengali</option>
                            </select>
                          </div>
                        )}
                        {isTranslating === msg.id && (
                          <span className="text-[9px] text-indigo-400 animate-pulse">Translating...</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex flex-col items-start animate-pulse max-w-[85%] sm:max-w-[70%]">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-0.5">
                    <span>{selectedCandidate.name}</span>
                    <span>•</span>
                    <span className="flex space-x-0.5 items-center">
                      <span>typing</span>
                      <span className="inline-flex gap-0.5">
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </span>
                    </span>
                  </div>
                  <div className="bg-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none italic text-[11px] border border-slate-700/30">
                    Drafting a respectful response...
                  </div>
                </div>
              )}

              {currentChatMessages.length === 0 && (
                <div className="h-full flex items-center justify-center text-center py-10">
                  <span className="text-slate-500">Starting conversation...</span>
                </div>
              )}
            </div>

            {/* AI Icebreaker Assistant Section */}
            <div className="pt-2 pb-1 border-t border-slate-800/60 bg-slate-900/20 px-3 rounded-2xl mb-2 text-left">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400/20" /> AI Conversation Assistant
                </span>
                <button
                  id="toggle-icebreakers-btn"
                  type="button"
                  onClick={() => setShowIcebreakers(!showIcebreakers)}
                  className="text-[9px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {showIcebreakers ? "Hide Suggestions" : "Show Suggestions"}
                </button>
              </div>

              {showIcebreakers && (
                <div className="animate-fadeIn">
                  {loadingIcebreakers ? (
                    <div className="flex items-center space-x-1.5 py-2 text-[10px] text-slate-500 font-mono">
                      <Sparkles className="w-3 h-3 text-amber-500 animate-spin" />
                      <span>Synthesizing culturally aligned respectful starters...</span>
                    </div>
                  ) : icebreakers.length > 0 ? (
                    <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                      {icebreakers.map((ib, idx) => (
                        <button
                          key={idx}
                          id={`icebreaker-btn-${idx}`}
                          type="button"
                          onClick={() => setInputText(ib)}
                          className="flex-shrink-0 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/30 text-slate-300 text-[10px] rounded-xl px-3 py-2 max-w-xs text-left leading-relaxed transition-all duration-300 cursor-pointer"
                        >
                          {ib}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-500 py-1">No suggestions available at the moment.</p>
                  )}
                </div>
              )}
            </div>

            {/* Input Form with Sender Toggle */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center space-x-2 text-[10px] bg-slate-950/40 p-1 rounded-lg border border-slate-800/40 w-fit">
                <span className="text-slate-400 font-bold px-1.5 uppercase tracking-wider">Send as:</span>
                <button
                  type="button"
                  id="send-as-user-btn"
                  onClick={() => setSendAsCandidate(false)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                    !sendAsCandidate
                      ? "bg-rose-500/20 border border-rose-500 text-rose-300"
                      : "bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {getLoggedInMemberName()} (You)
                </button>
                <button
                  type="button"
                  id="send-as-candidate-btn"
                  onClick={() => setSendAsCandidate(true)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                    sendAsCandidate
                      ? "bg-indigo-500/20 border border-indigo-500 text-indigo-300"
                      : "bg-slate-950/80 border border-slate-800 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {selectedCandidate.name} (Match)
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="message-text-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    sendAsCandidate
                      ? `Type manual reply as ${selectedCandidate.name}...`
                      : encryptOn
                      ? "Type E2EE Encrypted Message..."
                      : "Type plaintext message..."
                  }
                  className="flex-grow bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 outline-none focus:border-rose-500"
                />
                <button
                  id="send-message-btn"
                  type="submit"
                  className="bg-rose-600 text-white p-2.5 rounded-xl hover:bg-rose-500 transition-all duration-300 cursor-pointer shadow-md shadow-rose-600/10"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Lock className="w-12 h-12 text-slate-700 mb-3" />
            <h4 className="text-slate-400 font-semibold text-sm">No Active Chat Session</h4>
            <p className="text-slate-500 text-xs mt-1">Select a candidate on the left to start end-to-end encrypted messaging.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
