"use client"

import React, { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'



const dmSans = DM_Sans({ subsets: ['latin'] })

const NAV_ITEMS = [
  { label: "Home",         href: "#home" },
  { label: "Features",     href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing",      href: null },
  { label: "Docs",         href: null },
]

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const scrollTo = (href: string | null) => {
    if (!href) return;
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/" + href;
    }
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`${dmSans.className} fixed z-[9999] flex items-center justify-between transition-all duration-400
          ${scrolled
            ? "top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[1600px] rounded-full bg-[rgba(10,21,32,0.7)] backdrop-blur-md border border-white/10 px-6 md:px-10 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "top-0 left-1/2 -translate-x-1/2 w-[95%] bg-transparent px-4 md:px-14 py-4"
          }`}
      >
        {/* logo */}
        <a href="/" className="text-[#e8e2d5] no-underline font-light text-lg tracking-[0.25em] shrink-0">
          CodeClaria
        </a>

        {/* desktop links */}
        <ul className="hidden md:flex gap-7 lg:gap-11 list-none">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => scrollTo(item.href)}
                className="text-white no-underline font-light tracking-[0.12em] text-xs transition-opacity duration-300 hover:opacity-70 bg-transparent border-none cursor-pointer"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* desktop right side */}
        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          ) : session ? (
            // logged in
            <>
              <a href="/analyze" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-2 cursor-pointer">
                Analyze
              </a>
              <a href="/dashboard" className="text-sm font-medium text-white/70 hover:text-white transition-colors px-3 py-2 cursor-pointer">
                Dashboard
              </a>
              <div className="flex items-center gap-2 pl-3 cursor-pointer" style={{ borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                {session.user?.image && (
                  <a href="/profile">
                    <img src={session.user.image} alt="avatar" className="w-7 h-7 cursor-pointer rounded-full border border-white/10 hover:border-white/30 transition-all" />
                  </a>
                )}
                <a href="/profile" className="text-[13px] text-white/60 hover:text-white transition-colors">{session.user?.name?.split(" ")[0]}</a>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-[12px] text-white/40 hover:text-white/70 transition-colors ml-1"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            // logged out
            <>
              <a href="/login" className="text-sm font-medium bg-transparent border border-white/20 rounded-lg px-4 py-2 cursor-pointer text-white/70 hover:text-white hover:border-white/40 transition-all">
                Sign in
              </a>
              <a href="/login" className="text-sm font-medium bg-white text-[#07061a] rounded-lg px-4 py-2 cursor-pointer hover:bg-white/90 transition-all">
                Connect GitHub
              </a>
            </>
          )}
        </div>

        {/* mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-pointer p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
        </button>
      </nav>

      {/* mobile menu */}
      <div
        className={`${dmSans.className} fixed top-0 left-0 right-0 z-[9998] flex flex-col px-6 pt-24 pb-8 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(7,6,26,0.97)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <ul className="list-none flex flex-col gap-1 mb-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => { scrollTo(item.href); setMenuOpen(false); }}
                className="block w-full text-left text-white no-underline font-light text-[15px] py-3 border-b border-white/5 hover:text-white/60 transition-colors bg-transparent border-x-0 border-t-0"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {session ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {session.user?.image && (
                <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full border border-white/10" />
              )}
              <div>
                <p className="text-[13px] text-white">{session.user?.name}</p>
                <p className="text-[11px] text-white/40">{session.user?.email}</p>
              </div>
            </div>
            <a href="/analyze" className="w-full text-sm font-medium bg-white text-[#07061a] rounded-lg px-4 py-3 text-center">
              Analyze a Repo
            </a>
            <a href="/dashboard" className="w-full text-sm font-medium border border-white/20 rounded-lg px-4 py-3 text-center text-white/70">
              Dashboard
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-sm text-white/40 py-2"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <a href="/login" className="w-full text-sm font-medium bg-transparent border border-white/20 rounded-lg px-4 py-3 text-center text-white/70">
              Sign in
            </a>
            <a href="/login" className="w-full text-sm font-medium bg-white text-[#07061a] rounded-lg px-4 py-3 text-center">
              Connect GitHub
            </a>
          </div>
        )}
      </div>
    </>
  )
}

export default Navbar
