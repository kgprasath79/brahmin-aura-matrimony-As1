/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
// @ts-ignore
import logoImg from "../assets/images/kalasa_logo_1782732660048.jpg";

interface KalasaLogoProps {
  className?: string;
  size?: number;
}

export default function KalasaLogo({ className = "", size = 48 }: KalasaLogoProps) {
  // Double the size of the existing logo as requested by the user
  const finalSize = size * 2;

  return (
    <div
      className={`relative inline-block overflow-hidden rounded-full border-2 border-amber-400 shadow-[0_4px_12px_rgba(234,179,8,0.3)] transition-all duration-500 hover:scale-105 hover:border-amber-300 hover:shadow-[0_6px_20px_rgba(234,179,8,0.5)] ${className}`}
      style={{ width: finalSize, height: finalSize }}
    >
      <img
        src={logoImg}
        alt="Sacred Kalasa"
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      {/* Divine subtle outer golden overlay/glistening shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
}
