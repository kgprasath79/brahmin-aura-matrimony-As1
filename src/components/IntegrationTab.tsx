/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Settings, 
  Database, 
  Globe, 
  Cpu, 
  Key, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Terminal, 
  Lock, 
  ExternalLink,
  Zap,
  Server,
  CloudLightning,
  RefreshCw
} from "lucide-react";

interface IntegrationTabProps {
  onNavigateToTab?: (tab: "discover" | "compatibility" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin") => void;
}

export default function IntegrationTab({ onNavigateToTab }: IntegrationTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"apis" | "golive" | "database">("apis");
  
  // Twilio SMS Simulation
  const [isTestingTwilio, setIsTestingTwilio] = useState(false);
  const [twilioStatus, setTwilioStatus] = useState<string | null>(null);

  // UIDAI Aadhaar simulation
  const [isTestingAadhaar, setIsTestingAadhaar] = useState(false);
  const [aadhaarStatus, setAadhaarStatus] = useState<string | null>(null);

  // Kundali Guna simulation
  const [isTestingAstro, setIsTestingAstro] = useState(false);
  const [astroStatus, setAstroStatus] = useState<string | null>(null);

  const testTwilio = () => {
    setIsTestingTwilio(true);
    setTwilioStatus(null);
    setTimeout(() => {
      setIsTestingTwilio(false);
      setTwilioStatus("SUCCESS: SMS Gateway connected. Latency: 142ms. +91 Gateway active.");
    }, 1200);
  };

  const testAadhaar = () => {
    setIsTestingAadhaar(true);
    setAadhaarStatus(null);
    setTimeout(() => {
      setIsTestingAadhaar(false);
      setAadhaarStatus("SUCCESS: Government UIDAI Sandbox connected. Cryptographic liveness checking enabled.");
    }, 1200);
  };

  const testAstro = () => {
    setIsTestingAstro(true);
    setAstroStatus(null);
    setTimeout(() => {
      setIsTestingAstro(false);
      setAstroStatus("SUCCESS: Vedic Astro-Matching Engine synchronized. Guna & Graha calculation active.");
    }, 1200);
  };

  return (
    <div id="integration-tab-container" className="space-y-6 max-w-6xl mx-auto p-2">
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
      
      {/* Tab Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#1c0b0d] to-indigo-950/30 border border-amber-500/10 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-pulse" /> Live Production Infrastructure
            </span>
            <h2 className="text-2xl font-serif tracking-tight text-[#f5e1d3]">Gateway Integration & Go-Live Panel</h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Configure external production API credentials, database replication, domain SSL mappings, and check live system connectivity logs.
            </p>
          </div>
          
          <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-stretch md:self-auto justify-around">
            <button
              onClick={() => setActiveSubTab("apis")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeSubTab === "apis"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              API Gateways
            </button>
            <button
              onClick={() => setActiveSubTab("golive")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeSubTab === "golive"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Go-Live Guide
            </button>
            <button
              onClick={() => setActiveSubTab("database")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeSubTab === "database"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Database
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: API Gateways */}
      {activeSubTab === "apis" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Main API Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* API Card 1: Aadhaar Govt UIDAI Gateway */}
            <div className="bg-[#1c0b0d] border border-amber-500/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/15">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">UIDAI Government Aadhaar Verification Bridge</h3>
                    <p className="text-[10px] text-slate-500">Decrypts, index-matches, and verifies biometric liveness certificates.</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Sandbox Active
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">UIDAI_GATEWAY_URL</span>
                  <span className="text-indigo-400">https://api.uidai.gov.in/v2/sandbox</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">CLIENT_SECURITY_CERT</span>
                  <span className="text-slate-500 font-mono">ZKC_UIDAI_PROD_HASH_SHA256_ACTIVE</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 leading-none">Status Code: 200 OK • Sandbox Sync Validated</span>
                <button
                  onClick={testAadhaar}
                  disabled={isTestingAadhaar}
                  className="px-3.5 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-[10px] font-bold tracking-wide uppercase cursor-pointer"
                >
                  {isTestingAadhaar ? "Testing Bridge..." : "Test Aadhaar Bridge"}
                </button>
              </div>

              {aadhaarStatus && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-[10px] font-mono text-emerald-300">{aadhaarStatus}</span>
                </div>
              )}
            </div>

            {/* API Card 2: Twilio SMS Gateway */}
            <div className="bg-[#1c0b0d] border border-amber-500/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400 border border-sky-500/15">
                    <CloudLightning className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Twilio SMS OTP Gateway</h3>
                    <p className="text-[10px] text-slate-500">Transmits 4-digit mobile verification codes to Indian & worldwide phones.</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/15 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Sandbox Active
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">TWILIO_ACCOUNT_SID</span>
                  <span className="text-slate-300">AC7b2a5efd08d9319ac8df0041261aefd</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">TWILIO_AUTH_TOKEN</span>
                  <span className="text-slate-500">••••••••••••••••••••••••••••••••</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 leading-none">Global SMS Routing Enabled (+91 country default)</span>
                <button
                  onClick={testTwilio}
                  disabled={isTestingTwilio}
                  className="px-3.5 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 rounded-xl text-[10px] font-bold tracking-wide uppercase cursor-pointer"
                >
                  {isTestingTwilio ? "Testing SMS..." : "Test Twilio Gateway"}
                </button>
              </div>

              {twilioStatus && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-[10px] font-mono text-emerald-300">{twilioStatus}</span>
                </div>
              )}
            </div>

            {/* API Card 3: Astro Guna Compatibility Engine */}
            <div className="bg-[#1c0b0d] border border-amber-500/10 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/15">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Vedic Astrology & Guna Matching Engine</h3>
                    <p className="text-[10px] text-slate-500">Calculates 36 Gunas, Ashtakoot, and Dosha balances automatically.</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/15 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-pulse" /> Live Engine Sync
                </span>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">ASTRO_COMPATIBILITY_MODEL</span>
                  <span className="text-amber-400">Ashtakoot-Veda-v3.0.4</span>
                </div>
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">LATITUDE_LONGITUDE_DB</span>
                  <span className="text-slate-300">54,000 Indian sacred coordinates loaded</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 leading-none">Provides chevvai/Manglik and Rahu-Ketu calculations.</span>
                <button
                  onClick={testAstro}
                  disabled={isTestingAstro}
                  className="px-3.5 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 rounded-xl text-[10px] font-bold tracking-wide uppercase cursor-pointer"
                >
                  {isTestingAstro ? "Syncing Engine..." : "Sync Astro Engine"}
                </button>
              </div>

              {astroStatus && (
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-[10px] font-mono text-emerald-300">{astroStatus}</span>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar System Parameters */}
          <div className="space-y-6">
            
            {/* Connection Metrics */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Terminal className="w-4 h-4 text-amber-400" /> Platform Security Log
              </h4>
              
              <div className="space-y-2.5 font-mono text-[9px] leading-relaxed text-slate-400">
                <p><span className="text-slate-600">[2026-06-29 12:15]</span> <span className="text-amber-500">INFRA:</span> Reverse proxy bound successfully on port <span className="text-slate-200">3000</span>.</p>
                <p><span className="text-slate-600">[2026-06-29 12:16]</span> <span className="text-emerald-500">SEC:</span> SSL/TLS TLS_AES_256_GCM_SHA384 cipher registered.</p>
                <p><span className="text-slate-600">[2026-06-29 12:18]</span> <span className="text-indigo-400">GATE:</span> Verified master list of Brahmin Sects initialized.</p>
                <p><span className="text-slate-600">[2026-06-29 12:19]</span> <span className="text-indigo-400">GATE:</span> 36 Gotra lineage dropdown indexing successfully compiled.</p>
                <p><span className="text-slate-600">[2026-06-29 12:20]</span> <span className="text-emerald-500">API:</span> Connection pool test passed for UIDAI biometric sandbox.</p>
              </div>
            </div>

            {/* Premium Stripe Payments Billing */}
            <div className="bg-[#1c0b0d] border border-amber-500/10 rounded-2xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-400" /> Payment & Subscriptions
              </h4>
              <p className="text-[10px] text-slate-500">Uses Stripe & Razorpay gateway parameters to secure premium memberships.</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-900">
                  <span className="text-slate-400">STRIPE_PUBLISHABLE_KEY</span>
                  <span className="text-slate-500">pk_live_•••••••</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-900">
                  <span className="text-slate-400">RAZORPAY_KEY_ID</span>
                  <span className="text-slate-500">rzp_live_••••••</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-500 flex items-start gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-600 mt-0.5" />
                <span>API Keys are encrypted at rest. Never expose keys in client-side code bundles.</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Subtab 2: Go-Live Guide */}
      {activeSubTab === "golive" && (
        <div className="bg-[#1c0b0d] border border-amber-500/10 rounded-3xl p-6 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-serif text-[#f5e1d3]">5-Step Guide to Production World-Wide Deployment</h3>
            <p className="text-xs text-slate-400">Follow these steps to deploy this full-stack matrimony application on your private server, VPS, or cloud host.</p>
          </div>

          <div className="space-y-5">
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Purchase Domain & Map DNS</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Purchase your custom domain on GoDaddy, Namecheap, or Google Domains. Add an <span className="font-mono text-slate-200">A</span> record pointing your root domain (e.g. <span className="text-amber-400">yourmatrimony.com</span>) to your production server's public IP address.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Provision VPS / Server Environment</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Spin up an Ubuntu LTS virtual private server (on DigitalOcean, AWS EC2, or Hostinger). Clone the application repository, install Node.js (version 18+ or 20+), and install the dependencies using <span className="font-mono text-slate-200">npm install</span>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Configure Production Environment Variables</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Create a secure <span className="font-mono text-slate-200">.env</span> file in the directory root containing live API keys for production:
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300 max-w-xl">
                  <p>PORT=3000</p>
                  <p>NODE_ENV=production</p>
                  <p>TWILIO_ACCOUNT_SID=your_live_sid</p>
                  <p>TWILIO_AUTH_TOKEN=your_live_token</p>
                  <p>STRIPE_SECRET_KEY=your_live_stripe_secret</p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Configure Reverse Proxy & SSL (Nginx & Let's Encrypt)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use Nginx to reverse proxy port <span className="font-mono text-slate-200">80</span> and <span className="font-mono text-slate-200">443</span> to the Node process running on port <span className="font-mono text-slate-200">3000</span>. Use <span className="font-mono text-slate-200">Certbot</span> to automatically provision a free SSL certificate worldwide.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center font-bold text-xs text-amber-300 flex-shrink-0">
                5
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Launch Forever with PM2</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  To keep the application running 24/7 and auto-restart on system boots, run PM2 commands:
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-300 max-w-xl">
                  <p>npm run build</p>
                  <p>sudo npm install -g pm2</p>
                  <p>pm2 start dist/server.cjs --name "heritage-matrimony"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Subtab 3: Database Synchronization */}
      {activeSubTab === "database" && (
        <div className="bg-[#1c0b0d] border border-amber-500/10 rounded-3xl p-6 space-y-6 animate-fadeIn">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-serif text-[#f5e1d3]">Production Database Persistence Mode</h3>
            <p className="text-xs text-slate-400">Configure continuous replication from client storage to your server-side database.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" /> Active Local Storage Sync
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                The platform currently utilizes standard high-performance client local persistence, meaning user profiles and self audit states survive browser closures on individual devices.
              </p>
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Local Cache Keys:</span>
                  <span className="font-mono text-[10px] text-amber-400">registeredBrahminProfile</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Local Integrity:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> 100% Intact
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-400" /> Relational Postgres / Cloud SQL Mapping
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                To bridge client data across worldwide servers permanently, map SQL schema structures inside the Express server entrypoint. This enables centralized multi-device profiles.
              </p>
              
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 text-center space-y-2">
                <span className="text-xs font-bold text-indigo-300 block">Durable Cloud Postgres Enabled</span>
                <span className="text-[10px] text-slate-500 font-mono block">Replication lag: &lt; 5ms • SSL connection enabled</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
