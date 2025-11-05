"use client";
import React from "react";
import "./loader.css";

/**
 * Tailwind-friendly Loader
 * - Layout/size uses Tailwind utility classes
 * - Animation/keyframes are defined in a small CSS file (loader.css)
 *
 * Usage:
 *   import Loader from "@/components/Loader";
 *   <Loader className="mx-auto" />
 */
export default function Loader({ className = "" }: { className?: string }) {
  // The actual animated element uses the .loader class from loader.css
  // Container uses Tailwind for sizing and alignment.
  return (
    <div
      className={`${className} w-10 aspect-square flex items-center justify-center`}
    >
      <div className="loader" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
