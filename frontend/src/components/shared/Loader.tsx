"use client";
import React from "react";
import "./loader.css";

export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`${className} w-10 aspect-square flex items-center justify-center`}
    >
      <div className="loader" aria-hidden="true" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
