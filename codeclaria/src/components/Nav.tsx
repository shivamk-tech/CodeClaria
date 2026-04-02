"use client"
import Image from 'next/image'
import React, { useEffect } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { usePathname, useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

const navStyles = `
  .ocen-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 56px;
    background: transparent;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .ocen-nav.scrolled {
    top: 20px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1600px;
    border-radius: 9999px;
    background: rgba(10, 21, 32, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(232, 226, 213, 0.1);
    padding: 18px 40px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .ocen-logo {
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 18px;
    letter-spacing: 0.25em;
    color: #e8e2d5;
    text-decoration: none;
  }

  .ocen-nav-links {
    display: flex;
    gap: 44px;
    list-style: none;
  }

  .ocen-nav-links a {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: #e8e2d5;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.3s;
  }

  .ocen-nav-links a:hover { opacity: 1; }

  .ocen-nav-account {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.1em;
    color: #e8e2d5;
    opacity: 0.8;
    cursor: pointer;
  }

  @media (max-width: 1024px) {
    .ocen-nav {
      padding: 20px 32px;
    }

    .ocen-nav.scrolled {
      width: 95%;
      padding: 14px 28px;
    }

    .ocen-nav-links {
      gap: 28px;
    }

    .ocen-nav-links a {
      font-size: 12px;
    }
  }

  @media (max-width: 768px) {
    .ocen-nav {
      padding: 16px 24px;
    }

    .ocen-nav.scrolled {
      width: 96%;
      padding: 12px 20px;
      top: 12px;
    }

    .ocen-logo {
      font-size: 16px;
    }

    .ocen-nav-links {
      gap: 20px;
    }

    .ocen-nav-links a {
      font-size: 11px;
    }

    .ocen-nav-account {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    .ocen-nav {
      padding: 14px 16px;
    }

    .ocen-nav.scrolled {
      width: 98%;
      padding: 10px 16px;
    }

    .ocen-logo {
      font-size: 14px;
      letter-spacing: 0.15em;
    }

    .ocen-nav-links {
      display: none;
    }

    .ocen-nav-account {
      font-size: 10px;
    }
  }
`;

const Navbar = () => {

  const router = useRouter()  
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' }
  ]

  useEffect(() => {
    // Inject navbar styles
    const id = "navbar-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = navStyles;
      document.head.appendChild(tag);
    }

    // Scroll effect for navbar
    const handleScroll = () => {
      const nav = document.querySelector(".ocen-nav");
      if (nav) {
        if (window.scrollY > 10) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
     <nav className="ocen-nav">
        <a className="ocen-logo" href="#">CodeClaria</a>
        <ul className="ocen-nav-links">
          <li className='cursor-pointer text-white transition-colors duration-900'><a href="#">Home</a></li>
          <li className='cursor-pointer text-white transition-colors duration-900'><a href="#">Features</a></li>
          <li className='cursor-pointer text-white transition-colors duration-900'><a href="#">How it works</a></li>
          <li className='cursor-pointer text-white transition-colors duration-900'><a href="#">Pricing</a></li>
          <li className='cursor-pointer text-white transition-colors duration-900'><a href="#">Docs</a></li>
        </ul>
        <div className="ocen-nav-account">
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
