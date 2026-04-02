"use client"

import React, { useEffect, useState } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed z-[9999] flex items-center justify-between transition-all duration-400
        ${scrolled
          ? "top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[1600px] rounded-full bg-[rgba(10,21,32,0.7)] backdrop-blur-md border border-white/10 px-10 py-[18px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "top-0 left-0 right-0 w-full bg-transparent px-14 py-7"
        }`}
    >
      <a href="#" className="text-[#e8e2d5] no-underline font-light text-lg tracking-[0.25em]">
        CodeClaria
      </a>

      <ul className="hidden sm:flex gap-11 lg:gap-11 md:gap-7 list-none">
        {["Home", "Features", "How it works", "Pricing", "Docs"].map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-white/80 hover:text-white no-underline font-light tracking-[0.12em] text-xs md:text-[12px] transition-opacity duration-300"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 text-[13px] font-light tracking-[0.1em] text-[#e8e2d5]/80 cursor-pointer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
        Account
      </div>
    </nav>
  )
}

export default Navbar
