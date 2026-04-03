"use client"

import React, { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'] })

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`${dmSans.className} fixed z-[9999] flex items-center justify-between transition-all duration-400
        ${scrolled
          ? "top-5 left-1/2 -translate-x-1/2 w-[75%] max-w-[1600px] rounded-full bg-[rgba(10,21,32,0.7)] backdrop-blur-md border border-white/10 px-10 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          : "top-0 left-1/2 -translate-x-1/2 w-[85%] bg-transparent px-14 py-4"
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
              className="text-white hover:text-white no-underline font-light tracking-[0.12em] text-xs md:text-[12px] transition-opacity duration-300"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <button className="text-sm font-medium bg-transparent border border-white/20 rounded-lg px-4 py-2 cursor-pointer text-white/70 hover:text-white hover:border-white/40 transition-all">
          Sign up
        </button>
        <button className="text-sm font-medium bg-white text-[#07061a] rounded-lg px-4 py-2 cursor-pointer hover:bg-white/90 transition-all">
          Connect GitHub
        </button>
      </div>
    </nav>
  )
}

export default Navbar
