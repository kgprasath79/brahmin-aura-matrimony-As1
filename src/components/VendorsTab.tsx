/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Vendor, PaymentTx } from "../types";
import { Store, UserPlus, Coins, DollarSign, Phone, Mail, MapPin, Star, Sparkles, Check, ArrowRight, ShieldCheck, CreditCard, Lock, PlusCircle, AlertCircle, Bookmark, Calendar, Clock, Trash2, Heart } from "lucide-react";

// Seed data with authentic Brahmin services
const initialVendors: Vendor[] = [
  {
    id: "v1",
    name: "Pandit Ramachandra Shastri & Sons",
    category: "Purohit & Pujari",
    contactPerson: "Pandit Ramachandra",
    email: "shastri.puja@gmail.com",
    phone: "+91 94440 18274",
    location: "Varanasi & South India rituals",
    rating: 4.9,
    pricing: "Starting ₹20,000 / homam",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=500&q=80",
    bio: "Decades of experience in Rigveda and Yajurveedic rites. Specializing in Vivaha (wedding) homams, Grahapravesham, and customized Nakshatra shanti pujas.",
    commissionRate: 10,
    totalSales: 120000,
    commissionPaid: 8000,
    commissionDue: 4000,
  },
  {
    id: "v2",
    name: "Aura Vedic Astrology & Horoscope Matching",
    category: "Vedic Astrologer",
    contactPerson: "Astro Acharya Vidyasagar",
    email: "acharya.vidya@astro.org",
    phone: "+91 98840 29312",
    location: "Bangalore, India",
    rating: 4.8,
    pricing: "Starting ₹6,000 / Kundali matching",
    imageUrl: "https://images.unsplash.com/photo-1515942400757-45a4010c3f43?auto=format&fit=crop&w=500&q=80",
    bio: "Providing comprehensive Kundali match reviews, Guna Milan charts, and birth star analysis for the Brahmin community with highly accurate remedial counsel.",
    commissionRate: 10,
    totalSales: 64000,
    commissionPaid: 4400,
    commissionDue: 2000,
  },
  {
    id: "v3",
    name: "Saraswat Maha Prasadam Catering",
    category: "Sattvik Catering",
    contactPerson: "Chef Vasudev Prabhu",
    email: "prasadam.catering@gmail.com",
    phone: "+91 80234 49210",
    location: "Mumbai & Goa regions",
    rating: 4.9,
    pricing: "Starting ₹1,200 / plate",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80",
    bio: "Pristine, 100% pure Sattvik traditional food with zero garlic and onions. Specialized in catering Brahmin marriages, Upanyasam rituals, and upanayanams.",
    commissionRate: 10,
    totalSales: 336000,
    commissionPaid: 24000,
    commissionDue: 9600,
  }
];

interface WeddingBooking {
  id: string;
  clientName: string;
  clientPhone: string;
  ceremonyType: string;
  date: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  venue: string;
  notes?: string;
  bookedAt: string;
}

const AUSPICIOUS_DATES = [
  {
    date: "2026-07-12",
    label: "Aashadha Dwadashi Vivaha",
    nakshatra: "Uttara Phalguni",
    rasi: "Kanya (Virgo)",
    timing: "06:15 AM - 08:30 AM",
    description: "Highly auspicious for traditional Brahmin vivaha sanskar ceremonies. Strong planetary alignments."
  },
  {
    date: "2026-07-18",
    label: "Shubha Swati Yoga",
    nakshatra: "Swati",
    rasi: "Tula (Libra)",
    timing: "09:00 AM - 11:15 AM",
    description: "Ideal for horoscope matching consulting and lagna patrika card writing ceremonies."
  },
  {
    date: "2026-08-08",
    label: "Shravana Anuradha Kalyanam",
    nakshatra: "Anuradha",
    rasi: "Vrishchika (Scorpio)",
    timing: "07:30 AM - 09:45 AM",
    description: "Auspicious Gauri Kalyana Muhurtham. Bestows health, wealth and progeny."
  },
  {
    date: "2026-08-22",
    label: "Rohini Siddha Yoga",
    nakshatra: "Rohini",
    rasi: "Vrishabha (Taurus)",
    timing: "08:15 AM - 10:30 AM",
    description: "Excellent day for conducting Upanayanam (sacred thread) and pre-wedding engagement pujas."
  },
  {
    date: "2026-09-14",
    label: "Bhadrapada Hasta Muhurtham",
    nakshatra: "Hasta",
    rasi: "Kanya (Virgo)",
    timing: "06:00 AM - 08:15 AM",
    description: "Amrita Siddhi yoga morning alignment. Highly recommended for South Indian style Vivahams."
  },
  {
    date: "2026-10-25",
    label: "Karthika Anuradha Vivaha",
    nakshatra: "Anuradha",
    rasi: "Vrishchika (Scorpio)",
    timing: "10:15 AM - 12:30 PM",
    description: "First Shubha Muhurtham of Karthika month. Highly blessed by Lord Shiva and Parvati."
  }
];

interface VendorsTabProps {
  onNavigateToTab?: (tab: "discover" | "compatibility" | "messages" | "video" | "verify" | "vendors" | "audit" | "integration" | "admin") => void;
}

export default function VendorsTab({ onNavigateToTab }: VendorsTabProps) {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "enroll" | "portal" | "calendar">("directory");

  // Booking Calendar States
  const [bookings, setBookings] = useState<WeddingBooking[]>(() => {
    const savedBookings = localStorage.getItem("weddingCalendarBookings");
    if (savedBookings) {
      try {
        return JSON.parse(savedBookings);
      } catch (e) {
        console.error("Error loading wedding bookings", e);
      }
    }
    // Seed default bookings
    return [
      {
        id: "b-1",
        clientName: "Srinivas & Meenakshi Iyer",
        clientPhone: "+91 98845 10293",
        ceremonyType: "Traditional Vivaha (Wedding)",
        date: "2026-07-12",
        vendorId: "v1",
        vendorName: "Pandit Ramachandra Shastri & Sons",
        vendorCategory: "Purohit & Pujari",
        venue: "Venkateshwara Kalyana Mandapam, Mylapore, Chennai",
        notes: "Requesting Rigvedic sampradaya rituals and extra priests for homam.",
        bookedAt: "2026-06-30T10:15:00.000Z"
      },
      {
        id: "b-2",
        clientName: "Aditya & Lavanya Sharma",
        clientPhone: "+91 91234 56789",
        ceremonyType: "Horoscope Matching Consultation",
        date: "2026-07-18",
        vendorId: "v2",
        vendorName: "Aura Vedic Astrology & Horoscope Matching",
        vendorCategory: "Vedic Astrologer",
        venue: "Online Consultation Room 1",
        notes: "Detailed review of matching compatibility score and Guna Milan.",
        bookedAt: "2026-06-29T14:30:00.000Z"
      }
    ];
  });

  // Save bookings to local storage when changed
  React.useEffect(() => {
    localStorage.setItem("weddingCalendarBookings", JSON.stringify(bookings));
  }, [bookings]);

  // Booking Form State
  const [bookingClientName, setBookingClientName] = useState<string>("");
  const [bookingClientPhone, setBookingClientPhone] = useState<string>("");
  const [bookingCeremonyType, setBookingCeremonyType] = useState<string>("Traditional Vivaha (Wedding)");
  const [bookingDate, setBookingDate] = useState<string>("2026-07-12");
  const [bookingVendorId, setBookingVendorId] = useState<string>("v1");
  const [bookingVenue, setBookingVenue] = useState<string>("");
  const [bookingNotes, setBookingNotes] = useState<string>("");
  const [showBookingSuccess, setShowBookingSuccess] = useState<boolean>(false);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVendor = vendors.find(v => v.id === bookingVendorId) || vendors[0];
    const newBooking: WeddingBooking = {
      id: `b-${Date.now()}`,
      clientName: bookingClientName,
      clientPhone: bookingClientPhone,
      ceremonyType: bookingCeremonyType,
      date: bookingDate,
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      vendorCategory: selectedVendor.category,
      venue: bookingVenue || "To Be Finalized",
      notes: bookingNotes,
      bookedAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);
    setShowBookingSuccess(true);
    
    // Clear form
    setBookingClientName("");
    setBookingClientPhone("");
    setBookingVenue("");
    setBookingNotes("");
    
    setTimeout(() => {
      setShowBookingSuccess(false);
    }, 3000);
  };

  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this auspicious vendor booking?")) {
      setBookings(prev => prev.filter(b => b.id !== id));
    }
  };
  
  // Enroll Form State
  const [vendorName, setVendorName] = useState<string>("");
  const [vendorContact, setVendorContact] = useState<string>("");
  const [vendorEmail, setVendorEmail] = useState<string>("");
  const [vendorPhone, setVendorPhone] = useState<string>("");
  const [vendorCategory, setVendorCategory] = useState<Vendor["category"]>("Purohit & Pujari");
  const [vendorLocation, setVendorLocation] = useState<string>("");
  const [vendorBio, setVendorBio] = useState<string>("");
  const [vendorPricing, setVendorPricing] = useState<string>("");
  const [enrollSuccess, setEnrollSuccess] = useState<boolean>(false);

  // Portal selection & commission payouts
  const [selectedPortalVendor, setSelectedPortalVendor] = useState<Vendor | null>(initialVendors[0]);
  const [showPayoutModal, setShowPayoutModal] = useState<boolean>(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(50);
  const [isProcessingPayout, setIsProcessingPayout] = useState<boolean>(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<boolean>(false);

  // Card details for commission payout
  const [payoutCard, setPayoutCard] = useState<string>("4111 2222 3333 4444");
  const [payoutExpiry, setPayoutExpiry] = useState<string>("08/29");
  const [payoutCvv, setPayoutCvv] = useState<string>("118");

  const handleEnrollVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const newVendor: Vendor = {
      id: `v-${Date.now()}`,
      name: vendorName,
      category: vendorCategory,
      contactPerson: vendorContact,
      email: vendorEmail,
      phone: vendorPhone,
      location: vendorLocation,
      rating: 5.0,
      pricing: vendorPricing || "Inquire for quote",
      imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=500&q=80",
      bio: vendorBio,
      commissionRate: 10,
      totalSales: 0,
      commissionPaid: 0,
      commissionDue: 0
    };

    setVendors((prev) => [...prev, newVendor]);
    setEnrollSuccess(true);
    setSelectedPortalVendor(newVendor);
    
    // reset form fields
    setTimeout(() => {
      setEnrollSuccess(false);
      setActiveSubTab("portal");
      setVendorName("");
      setVendorContact("");
      setVendorEmail("");
      setVendorPhone("");
      setVendorLocation("");
      setVendorBio("");
      setVendorPricing("");
    }, 1500);
  };

  const handleOpenPayout = (vendor: Vendor) => {
    setPayoutAmount(vendor.commissionDue);
    setShowPayoutModal(true);
    setPayoutSuccessMsg(false);
  };

  const processCommissionPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortalVendor) return;

    setIsProcessingPayout(true);
    await new Promise((res) => setTimeout(res, 1200)); // Network latency simulator
    setIsProcessingPayout(false);
    setPayoutSuccessMsg(true);

    // Update locally stored commissions
    setVendors((prev) =>
      prev.map((v) => {
        if (v.id === selectedPortalVendor.id) {
          return {
            ...v,
            commissionPaid: v.commissionPaid + payoutAmount,
            commissionDue: Math.max(0, v.commissionDue - payoutAmount)
          };
        }
        return v;
      })
    );

    // Update active selected portal vendor state reference
    setSelectedPortalVendor((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        commissionPaid: prev.commissionPaid + payoutAmount,
        commissionDue: Math.max(0, prev.commissionDue - payoutAmount)
      };
    });

    setTimeout(() => {
      setShowPayoutModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
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
      
      {/* Sub Tabs Navigation */}
      <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
        <button
          id="vendor-subtab-directory"
          onClick={() => setActiveSubTab("directory")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === "directory" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Brahmin Service Directory</span>
        </button>

        <button
          id="vendor-subtab-enroll"
          onClick={() => setActiveSubTab("enroll")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === "enroll" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Business</span>
        </button>

        <button
          id="vendor-subtab-portal"
          onClick={() => setActiveSubTab("portal")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === "portal" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Pay Commission Portal</span>
        </button>

        <button
          id="vendor-subtab-calendar"
          onClick={() => setActiveSubTab("calendar")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer ${
            activeSubTab === "calendar" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Wedding Calendar</span>
        </button>
      </div>

      {/* Directory Tab */}
      {activeSubTab === "directory" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" /> Community Vedic Services
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Directly book verified Brahmin astrologers, purohits and sattvik caterers. 
              <span className="text-amber-300 font-semibold block mt-1">Note: All rates are set directly by the vendors; the platform does NOT fix or cap service rates.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300">
                <div className="relative h-44 bg-slate-950">
                  <img
                    src={vendor.imageUrl}
                    alt={vendor.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-amber-400 border border-amber-500/30 font-bold text-[9px] px-2 py-0.5 rounded-full tracking-wider uppercase">
                    {vendor.category}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white leading-normal truncate">{vendor.name}</h4>
                      <div className="flex items-center text-amber-400 text-xs font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-0.5" />
                        <span>{vendor.rating}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500">Contact: {vendor.contactPerson}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {vendor.bio}
                  </p>

                  <div className="bg-slate-950 p-2 rounded-xl text-[10px] space-y-1 text-slate-300 border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span>{vendor.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est Pricing:</span>
                      <span className="text-amber-400 font-semibold">{vendor.pricing}</span>
                    </div>
                  </div>

                  <button
                    id={`book-vendor-${vendor.id}`}
                    onClick={() => alert(`Inquiry for ${vendor.name} registered. We will match you shortly.`)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/50 transition-all duration-300 cursor-pointer"
                  >
                    Direct Inquiry & Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Register Business Form */}
      {activeSubTab === "enroll" && (
        <div className="max-w-xl mx-auto animate-fadeIn">
          <form onSubmit={handleEnrollVendor} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-200">Brahmin Vendor Registration</h3>
              <p className="text-xs text-slate-400 mt-1">Enroll your wedding services, astorological consultancies, or catering business into Aura.</p>
            </div>

            {enrollSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-1.5 animate-pulse text-emerald-400 text-xs">
                <Check className="w-5 h-5 mx-auto" />
                <span>Application Approved! Enrolled in platform database.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service/Business Name</label>
                <input
                  id="enroll-name"
                  type="text"
                  required
                  placeholder="e.g. Purohit Kalyana Services"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Person</label>
                <input
                  id="enroll-contact"
                  type="text"
                  required
                  placeholder="e.g. Shri Vasudeva"
                  value={vendorContact}
                  onChange={(e) => setVendorContact(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <input
                  id="enroll-email"
                  type="email"
                  required
                  placeholder="e.g. contact@purohit.com"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                <input
                  id="enroll-phone"
                  type="tel"
                  required
                  placeholder="e.g. +91 9884..."
                  value={vendorPhone}
                  onChange={(e) => setVendorPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  id="enroll-category"
                  value={vendorCategory}
                  onChange={(e) => setVendorCategory(e.target.value as Vendor["category"])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Purohit & Pujari">Purohit & Pujari (Weddings & Homams)</option>
                  <option value="Vedic Astrologer">Vedic Astrologer (Horoscope Match)</option>
                  <option value="Sattvik Catering">Sattvik Catering (Vegetarian Feast)</option>
                  <option value="Heritage Kalyana Mandapam">Heritage Kalyana Mandapam</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est/Starting Price</label>
                <input
                  id="enroll-pricing"
                  type="text"
                  required
                  placeholder="e.g. ₹12,000 / day"
                  value={vendorPricing}
                  onChange={(e) => setVendorPricing(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operation Location & Coverage</label>
              <input
                id="enroll-location"
                type="text"
                required
                placeholder="e.g. Chennai, Bangalore & Hyderabad"
                value={vendorLocation}
                onChange={(e) => setVendorLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business description & Vedic credentials</label>
              <textarea
                id="enroll-bio"
                required
                rows={3}
                placeholder="Describe your lineage, traditional certifications, past weddings conducted..."
                value={vendorBio}
                onChange={(e) => setVendorBio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-amber-500 font-sans resize-none"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-2 leading-relaxed">
              <span className="font-bold text-slate-300 block flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" /> Platform Fee Policy (No Fixed Service Rates)
              </span>
              <p>
                We believe in community empowerment. **We do NOT fix, cap, or dictate the rates for your services.** You have complete freedom to price your rituals, astrologies, or catering packages as you see fit.
              </p>
              <div className="w-full h-px bg-slate-800 my-1" />
              <div className="space-y-1">
                <div className="flex justify-between text-amber-400 font-mono">
                  <span>Annual Listing/Platform Fee:</span>
                  <span>₹5,000 / Year</span>
                </div>
                <div className="flex justify-between text-amber-400 font-mono">
                  <span>Booking Commission:</span>
                  <span>Flat 10% on your booking value</span>
                </div>
              </div>
            </div>

            <button
              id="submit-enrollment-btn"
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-bold text-xs rounded-xl transition-all duration-300 cursor-pointer"
            >
              Sign Commission Agreement & Enroll
            </button>
          </form>
        </div>
      )}

      {/* Pay Commission Portal (Interactive business cockpit) */}
      {activeSubTab === "portal" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Vendor selector to test different accounts */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Active Vendor Session</span>
              <span className="text-slate-200 font-bold text-xs">Select enrolled account to manage commission billing:</span>
            </div>
            <div className="flex gap-2">
              {vendors.map((v) => (
                <button
                  key={v.id}
                  id={`select-portal-${v.id}`}
                  onClick={() => setSelectedPortalVendor(v)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all duration-300 cursor-pointer ${
                    selectedPortalVendor?.id === v.id
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {v.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {selectedPortalVendor ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Stats & Financial Overview */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-3">Lineage Business Cockpit</h4>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-3.5 text-center py-4">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block tracking-wider font-mono">Platform Commission Rate</span>
                      <span className="text-3xl font-extrabold text-amber-400 font-mono">{selectedPortalVendor.commissionRate}%</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Flat on booking values</span>
                    </div>
                    <div className="border-t border-slate-800/80 pt-2 flex justify-between items-center text-[10px] px-2 text-slate-400">
                      <span>Annual Platform Fee:</span>
                      <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-md font-bold uppercase border border-emerald-500/20">₹5,000 Paid (Active)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Total Booking Sales:</span>
                    <span className="font-mono text-slate-100 font-bold">₹{selectedPortalVendor.totalSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Paid Commission:</span>
                    <span className="font-mono text-emerald-400 font-bold">₹{selectedPortalVendor.commissionPaid.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="w-full h-px bg-slate-800" />
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-200 font-semibold">Outstanding Due:</span>
                    <span className="font-mono text-rose-400 font-extrabold text-sm">₹{selectedPortalVendor.commissionDue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {selectedPortalVendor.commissionDue > 0 ? (
                  <button
                    id="trigger-commission-payout"
                    onClick={() => handleOpenPayout(selectedPortalVendor)}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    Clear Commission (₹{selectedPortalVendor.commissionDue.toLocaleString('en-IN')})
                  </button>
                ) : (
                  <div className="bg-emerald-500/10 text-emerald-400 text-center py-2 border border-emerald-500/20 rounded-xl text-xs font-semibold">
                    Platform Balance Settled
                  </div>
                )}
              </div>

              {/* Right Column: Bookings log & simulated leads list */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Client Referrals & Sales Log</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Leads matched via Astro algorithms and Brahmin community registries.</p>
                </div>

                {/* Simulated booking logs */}
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">Srinivasan Iyer - Grahapravesham Pooja</span>
                      <span className="text-[10px] text-slate-500 font-mono">June 24, 2026 • Bangalore</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-300 block">₹32,000.00</span>
                      <span className="text-[10px] text-rose-400 font-mono font-bold">{selectedPortalVendor.commissionRate}% Comm (₹{(32000 * selectedPortalVendor.commissionRate / 100).toLocaleString('en-IN')})</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">Karthik Sharma - Marriage Astrological Charting</span>
                      <span className="text-[10px] text-slate-500 font-mono">June 18, 2026 • Pune</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-300 block">₹20,000.00</span>
                      <span className="text-[10px] text-rose-400 font-mono font-bold">{selectedPortalVendor.commissionRate}% Comm (₹{(20000 * selectedPortalVendor.commissionRate / 100).toLocaleString('en-IN')})</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-200 block">Aisha & Rohan - Wedding Catering Contract (Advance)</span>
                      <span className="text-[10px] text-slate-500 font-mono">June 12, 2026 • Chennai</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-300 block">₹12,000.00</span>
                      <span className="text-[10px] text-rose-400 font-mono font-bold">{selectedPortalVendor.commissionRate}% Comm (₹{(12000 * selectedPortalVendor.commissionRate / 100).toLocaleString('en-IN')})</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400 text-xs py-12">
              Select or register a Brahmin vendor account above to explore the commission ledger.
            </div>
          )}

        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && selectedPortalVendor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 animate-fadeIn">
            
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Coins className="w-5 h-5 text-emerald-400" /> Commission Settlement Portal
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Settle commission owed on matched bookings</p>
              </div>
              <button
                onClick={() => setShowPayoutModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold bg-slate-950 px-2.5 py-1 rounded-lg"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-semibold text-slate-300">{selectedPortalVendor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Commission Rate</span>
                <span className="font-mono text-slate-300">{selectedPortalVendor.commissionRate}%</span>
              </div>
              <div className="w-full h-px bg-slate-800 my-1" />
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-slate-500">Outstanding Balance</span>
                <span className="text-base font-extrabold text-rose-400">₹{selectedPortalVendor.commissionDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {payoutSuccessMsg ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-2 animate-fadeIn text-xs">
                <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                <span className="font-bold text-emerald-400">Commission Settled Successfully</span>
                <p className="text-[10px] text-slate-400">Ledger balance updated. Thank you for partnering with Heritage Matrimony.</p>
              </div>
            ) : (
              <form onSubmit={processCommissionPayment} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Settlement Amount (₹)</label>
                  <input
                    id="payout-amount-input"
                    type="number"
                    max={selectedPortalVendor.commissionDue}
                    min={1}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Settle via Card</label>
                  <div className="relative">
                    <input
                      id="payout-card-num"
                      type="text"
                      required
                      value={payoutCard}
                      onChange={(e) => setPayoutCard(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Expiry</label>
                    <input
                      id="payout-card-expiry"
                      type="text"
                      required
                      value={payoutExpiry}
                      onChange={(e) => setPayoutExpiry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CVV</label>
                    <input
                      id="payout-card-cvv"
                      type="password"
                      required
                      value={payoutCvv}
                      onChange={(e) => setPayoutCvv(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {isProcessingPayout ? (
                  <div className="bg-amber-500/10 text-amber-400 text-center py-2.5 border border-amber-500/20 rounded-xl font-bold animate-pulse">
                    Routing to Secure Payment API...
                  </div>
                ) : (
                  <button
                    id="submit-payout-btn"
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    Authorize Payout of ₹{payoutAmount.toLocaleString('en-IN')}
                  </button>
                )}
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
