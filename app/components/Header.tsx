"use client";

import Link from "next/link";
import Dropdown from "./Dropdown";
import Image from "next/image";
import React, { useState, ReactNode } from "react";

type HeaderProps = {
  children?: ReactNode; // for filters
};

export default function Header({ children }: HeaderProps) {
  const [activeNav, setActiveNav] = useState("Find Doctors");

  return (
    <>
      {/* Primary Header */}
      <header className="bg-[#fafafa] py-6 px-6 text-xs font-light text-[#414146]">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-xl font-bold pl-4">
              <Image src="/Logo_1.png" alt="Logo" width={100} height={40} priority />
            </Link>

            <nav className="hidden pl-4 md:flex space-x-6 font-medium text-[15px] text-[#484a59]">
              {["Find Doctors", "Video Consult", "Surgeries"].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className={`relative cursor-pointer pb-[2px] ${
                    activeNav === item
                      ? "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[6px] after:bottom-[-12px] after:bg-blue-500"
                      : ""
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>


          <div className="flex flex-wrap items-center gap-4  md:flex-nowrap">

            <menu className="hidden md:flex space-x-4">
              <Dropdown
                label="For Corporates"
                items={[
                  { label: "Health & Wellness Plans", href: "#" },
                  { label: "Group Insurance", href: "#" },
                ]}
              />
              <Dropdown
                label="For Providers"
                items={[
                  { label: "Clinics", href: "#" },
                  { label: "Doctors", href: "#" },
                  { label: "Diagnostic Labs", href: "#" },
                ]}
              />
              <Dropdown
                label="Security & Help"
                items={[
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms", href: "#" },
                  { label: "Help Center", href: "#" },
                ]}
              />
            </menu>

            <Link
              href="#"
              className="flex items-center border border-zinc-500 rounded-sm text-zinc-500 px-2 py-1 text-sm"
            >
              Login / Signup
            </Link>
          </div>
        </div>
      </header>

      {/* Optional Filters Header */}
      {children && (
        <div className="w-full bg-[#24318f] px-6 py-2 text-white">{children}</div>
      )}
    </>
  );
}
