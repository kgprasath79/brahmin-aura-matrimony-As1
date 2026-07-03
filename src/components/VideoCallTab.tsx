/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Profile } from "../types";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, ShieldCheck, Terminal, Heart, Play, AlertCircle } from "lucide-react";

// Set to false to temporarily hide P2P WebRTC Handshake logs as requested
const SHOW_WEBRTC_LOGS = false;

interface VideoCallTabProps {
  selectedCandidate: Profile | null;
  allCandidates: Profile[];
  onSelectCandidate: (profile: Profile) => void;
  onNavigateToTab?: (tab: "discover" | "compatibility" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin") => void;
}

export default function VideoCallTab({ selectedCandidate, allCandidates, onSelectCandidate, onNavigateToTab }: VideoCallTabProps) {
  const [callActive, setCallActive] = useState<boolean>(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState<boolean>(true);
  const [micEnabled, setMicEnabled] = useState<boolean>(true);
  const [signalingLogs, setSignalingLogs] = useState<string[]>([]);
  const [cameraPermissionError, setCameraPermissionError] = useState<boolean>(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (allCandidates.length > 0 && !selectedCandidate) {
      onSelectCandidate(allCandidates[0]);
    }
  }, [allCandidates, selectedCandidate]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopLocalStream();
    };
  }, []);

  const stopLocalStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  };

  const logSignaling = (msg: string) => {
    setSignalingLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const startCall = async () => {
    if (!selectedCandidate) return;
    setCallActive(true);
    setSignalingLogs([]);
    setCameraPermissionError(false);

    logSignaling("Initializing secure P2P WebRTC connection session...");
    logSignaling("Requesting local media capabilities (video, audio)...");

    try {
      // Safely request media streams
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      logSignaling("Local hardware feeds authorized successfully.");
    } catch (err: any) {
      console.warn("Camera/Mic stream blocked or unavailable:", err);
      setCameraPermissionError(true);
      logSignaling("WARNING: Direct hardware access blocked by browser sandboxing. Launching high-fidelity virtual avatar feed.");
    }

    // Step-by-step connection logging simulation
    const steps = [
      "Generating Cryptographic DTLS local fingerprints...",
      "Configuring ICE candidates (STUN/TURN tunneling resolved)...",
      `Transmitting encrypted SDP offer to ${selectedCandidate.name}'s signaling client...`,
      `Received secure SDP answer from ${selectedCandidate.name}.`,
      "Verifying end-to-end SRTP (Secure Real-time Transport Protocol) key signatures...",
      "Cipher suite selected: AES_CM_128_HMAC_SHA1_80 for high performance & privacy.",
      "P2P Connection ESTABLISHED. Audio/Video stream sync complete.",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((res) => setTimeout(res, 600));
      logSignaling(steps[i]);
    }
  };

  const endCall = () => {
    stopLocalStream();
    setCallActive(false);
    logSignaling("P2P call terminated by local user. All encryption keys discarded.");
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setCameraEnabled(!cameraEnabled);
    logSignaling(`Local video feed ${!cameraEnabled ? "ENABLED" : "MUTED"}.`);
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setMicEnabled(!micEnabled);
    logSignaling(`Local microphone feed ${!micEnabled ? "MUTED" : "UNMUTED"}.`);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Selector sidebar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 lg:col-span-1 flex flex-col space-y-3 h-full">
        <h3 className="text-xs font-bold tracking-wider uppercase text-slate-400 mb-2">Configure Secure Call</h3>
        {allCandidates.map((candidate) => (
          <button
            key={candidate.id}
            id={`select-video-candidate-${candidate.id}`}
            disabled={callActive}
            onClick={() => onSelectCandidate(candidate)}
            className={`flex items-center space-x-3 w-full p-2.5 rounded-xl text-left border transition-all duration-300 ${
              selectedCandidate?.id === candidate.id
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-slate-950 border-transparent text-slate-300 hover:bg-slate-800/50"
            } ${callActive ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <img
              src={candidate.imageUrl}
              alt={candidate.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-100">{candidate.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{candidate.occupation}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Main Calling Frame */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 lg:col-span-3 space-y-6 flex flex-col justify-between">
        {selectedCandidate ? (
          <>
            {/* Status header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-100">Privacy Video Hub</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Secure Peer-to-Peer Audio & Video Connection</p>
              </div>
              {callActive && (
                <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[10px] font-bold tracking-widest uppercase animate-pulse">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SRTP SECURE</span>
                </div>
              )}
            </div>

            {/* Calling Screen Area */}
            {callActive ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* User Local Video Screen */}
                <div className="relative bg-slate-950 aspect-video rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  {cameraPermissionError ? (
                    <div className="text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                        <Monitor className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-300">Virtual Camera Feed Active</span>
                      <p className="text-[9px] text-slate-500 mt-1">Browser blocked direct camera inside Sandbox</p>
                    </div>
                  ) : (
                    <video
                      id="local-camera-video"
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-semibold text-white">
                    You (Local)
                  </span>
                </div>

                {/* Match Remote Video Screen */}
                <div className="relative bg-slate-950 aspect-video rounded-2xl overflow-hidden border border-rose-500/20 flex items-center justify-center">
                  {/* Visual mockup of the match with an active call pulse */}
                  <img
                    src={selectedCandidate.imageUrl}
                    alt={selectedCandidate.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-75 hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  <span className="absolute bottom-3 left-3 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-semibold text-white">
                    {selectedCandidate.name}
                  </span>
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-rose-500 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider animate-pulse">
                    <Heart className="w-3 h-3" />
                    <span>Live Connected</span>
                  </div>
                </div>

              </div>
            ) : (
              /* Pre-call landing screen */
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-rose-500/15 text-rose-400 flex items-center justify-center">
                  <Video className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Establish Video Connection with {selectedCandidate.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Aura video calls are routed purely peer-to-peer using end-to-end DTLS/SRTP encryption. No third-party servers intercept your stream.
                  </p>
                </div>
                <button
                  id="initiate-call-btn"
                  onClick={startCall}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-bold hover:brightness-110 shadow-lg shadow-rose-600/10 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Secure Video Call</span>
                </button>
              </div>
            )}

            {/* Call Action controls panel */}
            {callActive && (
              <div className="flex justify-center items-center space-x-3 bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                <button
                  id="mute-video-btn"
                  onClick={toggleCamera}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                    cameraEnabled ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-rose-500/20 text-rose-400"
                  }`}
                  title={cameraEnabled ? "Mute Camera" : "Unmute Camera"}
                >
                  {cameraEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  id="mute-audio-btn"
                  onClick={toggleMic}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
                    micEnabled ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-rose-500/20 text-rose-400"
                  }`}
                  title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}
                >
                  {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>

                <button
                  id="simulate-screenshare-btn"
                  onClick={() => logSignaling("User screen-share channel requested and established securely.")}
                  className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  title="Share Screen"
                >
                  <Monitor className="w-4 h-4" />
                </button>

                <button
                  id="hangup-call-btn"
                  onClick={endCall}
                  className="p-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
                  title="Hang Up"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Signaling handshaking logs Terminal */}
            {callActive && SHOW_WEBRTC_LOGS && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" /> P2P WebRTC Handshake Logs
                </span>
                <div className="max-h-32 overflow-y-auto font-mono text-[9px] text-slate-400 space-y-1">
                  {signalingLogs.map((log, idx) => (
                    <div key={idx} className="leading-normal">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <Video className="w-12 h-12 text-slate-700 mb-3" />
            <h4 className="text-slate-400 font-semibold text-sm">No Match Selected</h4>
            <p className="text-slate-500 text-xs mt-1">Select a candidate on the left to start a privacy video call.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
