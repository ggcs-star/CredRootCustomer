import React, { useState, useEffect } from "react";
import {
  FaLinkedinIn,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const [user, setUser] = useState(null);
  const currentYear = new Date().getFullYear();

  // Check if user is logged in
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setUser(null);
      }
    };

    loadUser();

    // Listen for auth changes
    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  return (
    <footer className="bg-gradient-to-r from-[#031B4E] via-[#042766] to-[#031B4E] text-white">
        <div className={`max-w-7xl mx-auto px-6 lg:px-8  pb-6 ${!user ? 'pt-12' : ' '}`}>
        {/* Only show full footer content when user is NOT logged in */}
        {!user && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Logo */}
            <div>
              <h2 className="text-3xl font-semibold mb-4">
                <span className="text-white">Cred</span>
                <span className="text-[#2D8CFF]">Root</span>
              </h2>

              <p className="text-white/80 text-sm leading-7">
                Tech-enabled platform that facilitates MSMEs,
                retailers, distributors & enterprises to access
                affordable credit directly from lenders.
              </p>

              <div className="flex gap-3 mt-6">
                <SocialIcon icon={<FaLinkedinIn />} />
                <SocialIcon icon={<FaFacebookF />} />
                <SocialIcon icon={<FaInstagram />} />
                <SocialIcon icon={<FaYoutube />} />
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Products
              </h3>

              <ul className="space-y-3 text-white/80 text-sm">
                <li>Collateral backed Loans</li>
                <li>Collateral Free Loans</li>
                <li>Hybrid Loans</li>
                <li>Project Finance</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Company
              </h3>

              <ul className="space-y-3 text-white/80 text-sm">
                <li>
                  <Link to="/">About Us</Link>
                </li>
                <li>
                  <Link to="/">Why CredRoot?</Link>
                </li>
                <li>
                  <Link to="/">FAQs</Link>
                </li>
                <li>
                  <Link to="/">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Legal
              </h3>

              <ul className="space-y-3 text-white/80 text-sm">
                <li>
                  <Link to="/privacy-policy">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link to="/terms-and-conditions">
                    Terms & Conditions
                  </Link>
                </li>

                <li>
                  <Link to="/disclaimer">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-lg mb-4">
                Newsletter
              </h3>

              <p className="text-white/80 text-sm mb-4 leading-6">
                Subscribe to get updates and latest news
              </p>

              <div className="flex w-full max-w-[280px]">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    flex-1
                    h-11
                    px-4
                    bg-white
                    text-gray-800
                    placeholder:text-gray-500
                    text-sm
                    max-w-[150px]
                    outline-none
                    rounded-l-md
                  "
                />

                <button
                  type="button"
                  className="
                    w-12
                    h-11
                    bg-[#2D8CFF]
                    hover:bg-[#1E7AF5]
                    flex items-center justify-center
                    text-white
                    rounded-r-md
                    transition-all
                    duration-300
                  "
                >
                  <FaTelegramPlane size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Section - Always visible */}
        <div className={`border-t ${!user ? 'border-white/15  mt-10' : 'border-white/30 '} pt-5 flex flex-col md:flex-row items-center justify-between`}>
          <p className="text-sm text-white/70">
            © {currentYear} CredRoot. All rights reserved.
          </p>

          <p className="text-sm text-white/70 mt-3 md:mt-0">
            Made with ❤️ for MSMEs
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }) {
  return (
    <button
      className="
        w-9 h-9
        rounded-full
        border border-white/20
        flex items-center justify-center
        text-white
        hover:bg-[#2D8CFF]
        transition-all
      "
    >
      {icon}
    </button>
  );
}