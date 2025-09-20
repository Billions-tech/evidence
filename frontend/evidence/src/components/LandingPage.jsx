import React from "react";
import {
  FaMobileAlt,
  FaLock,
  FaReceipt,
  FaUserPlus,
  FaRegEdit,
  FaShareSquare,
} from "react-icons/fa";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-700 flex flex-col font-sans animate-fadein">
      {/* Navbar */}
      <nav className="w-full px-4 py-3 flex items-center justify-between bg-indigo-950 bg-opacity-80 shadow-lg fixed top-0 left-0 z-20">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Evidence Logo" className="w-8 h-8" />
          <span className="text-xl md:text-2xl font-bold text-white tracking-wide">
            Evidence
          </span>
        </div>
        <div className="hidden md:flex gap-6">
          <a
            href="#features"
            className="text-indigo-100 hover:text-yellow-400 font-medium transition"
          >
            Features
          </a>
          <a
            href="#cta"
            className="text-indigo-100 hover:text-yellow-400 font-medium transition"
          >
            Get Started
          </a>
        </div>
        <a
          href="/login"
          className="md:hidden bg-yellow-400 text-indigo-900 font-bold py-2 px-4 rounded-full shadow hover:bg-yellow-300 transition"
        >
          App
        </a>
      </nav>
      {/* Spacer for navbar */}
      <div className="h-16" />
      {/* Hero Section */}
      <header className="flex flex-col sm:flex-row items-center text-center  justify-between py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="flex-1 flex flex-col items-center sm:items-start justify-center ">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-slidein">
            Evidence
          </h1>
          <p className="text-xl md:text-2xl text-indigo-200 font-semibold mb-6 animate-fadein">
            no be cho cho cho!
          </p>
          <p className="text-lg text-indigo-100 max-w-xl mb-8 animate-fadein">
            Make your receipts dey legit, sharp sharp. No more wahala, no more
            stories. Evidence dey for you, anytime, anyday.
          </p>
          <a
            href="/app"
            className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 animate-bounce"
          >
            Start to Use Evidence Now
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/photo.png"
            alt="Hero"
            className="w-100 h-100 rounded-full shadow-lg shadow-indigo-40 mx-auto mb-6 animate-fadein"
          />
        </div>
      </header>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 px-4 max-w-5xl mx-auto grid md:grid-cols-3 gap-8 animate-fadein"
      >
        <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
          <FaReceipt className="text-5xl text-yellow-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Receipts Wey Make Sense
          </h2>
          <p className="text-indigo-100">
            No more fake receipts. Your customers go see say you dey legit.
            Everything clear, everything coded.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
          <FaMobileAlt className="text-5xl text-green-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Mobile & Easy</h2>
          <p className="text-indigo-100">
            Use am for phone, use am for laptop. Share, download, print – anyhow
            you want am, Evidence dey deliver.
          </p>
        </div>
        <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg hover:scale-105 transition-transform">
          <FaLock className="text-5xl text-indigo-300 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Your Data, Your Power
          </h2>
          <p className="text-indigo-100">
            No be say we go carry your info waka. Everything secure, na only you
            get access. Na Evidence way be that.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto animate-fadein">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          How Evidence Dey Work
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <FaUserPlus className="text-5xl text-yellow-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Sign Up Quick</h3>
            <p className="text-indigo-100 text-center">
              Oya, register sharp sharp. No stress, no long talk.
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <FaRegEdit className="text-5xl text-green-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Create Receipt
            </h3>
            <p className="text-indigo-100 text-center">
              Fill in your business info, add items, and Evidence go run am for
              you.
            </p>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <FaShareSquare className="text-5xl text-indigo-300 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              Share or Print
            </h3>
            <p className="text-indigo-100 text-center">
              Download, share, or print your receipt. E go dey correct, e go dey
              legit.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto animate-fadein">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          People Wey Don Use Evidence
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <span className="w-20 h-20 rounded-full mb-4 flex items-center justify-center bg-indigo-800">
              <FaUserPlus className="text-3xl text-yellow-400" />
            </span>
            <p className="text-indigo-100 text-center mb-2">
              “Evidence don make my business dey shine. My customers dey trust
              me more now.”
            </p>
            <span className="text-yellow-400 font-bold">- Chinedu, Lagos</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg">
            <span className="w-20 h-20 rounded-full mb-4 flex items-center justify-center bg-indigo-800">
              <FaUserPlus className="text-3xl text-yellow-400" />
            </span>
            <p className="text-indigo-100 text-center mb-2">
              “No more wahala with receipts. Evidence dey make everything easy
              for me.”
            </p>
            <span className="text-yellow-400 font-bold">- Amaka, Abuja</span>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="cta"
        className="py-16 px-4 flex flex-col mx-auto sm:flex-row items-center justify-center animate-fadein gap-1"
      >
        <div className="flex-1 flex flex-col items-center  justify-center">
          <h2 className="text-3xl md:text-4xl text-start font-bold text-white mb-4 animate-slidein">
            No dull yourself!
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl text-center animate-fadein">
            Join beta users wey don dey use Evidence. Make your business dey
            shine, make your receipts dey correct. Oya, no waste time!
          </p>
          <a
            href="/login"
            className="bg-indigo-400 hover:bg-indigo-300 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 animate-bounce"
          >
            Try Evidence Free
          </a>
        </div>
        <div className="flex-1 flex hidden items-center justify-center">
          <img
            src="/girl.png"
            alt="CTA Girl"
            className="w-130 h-100   animate-fadein"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-4 text-center text-indigo-200 text-sm bg-indigo-950 bg-opacity-80 mt-auto animate-fadein">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <span>
            &copy; {new Date().getFullYear()} Evidence. All rights reserved.
          </span>
          <span className="md:inline hover:underline hover:text-yellow-400">
            <a href="https://wa.me/2347058207225">
              {" "}
              Powered by Billions Technologies
            </a>
          </span>
          <span className="italic">No be cho cho cho!</span>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        .animate-fadein { animation: fadein 1.2s ease; }
        .animate-slidein { animation: slidein 1s cubic-bezier(.68,-0.55,.27,1.55); }
        .animate-bounce { animation: bounce 2s infinite; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slidein { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}
