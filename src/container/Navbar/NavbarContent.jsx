import React, { useState, useEffect } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../../api"; // Import logout API

export default function NavbarContent() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Load User & Listen For Login/Logout Events
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

    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call logout API
      await logoutUser();
      
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Update state immediately
      setUser(null);
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event("authChanged"));
      
      // Close mobile menu
      setMenuOpen(false);
      
      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if API fails, clear local data and logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      window.dispatchEvent(new Event("authChanged"));
      setMenuOpen(false);
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const menuItems = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Why CredRoot?", id: "why-credroot" },
    { label: "Products", id: "products" },
    { label: "FAQs", id: "faqs" },
    { label: "Contact", id: "contact" },
  ];

  const scrollToSection = (id) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/", {
        state: {
          scrollTo: id,
        },
      });
      return;
    }

    const element = document.getElementById(id);

    if (element) {
      const navbarHeight = 90;

      const offsetTop =
        element.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`w-full z-50 border-b border-gray-200 bg-[#f3f3f3] ${
        isScrolled ? "fixed top-0 left-0 shadow-md" : "relative"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-[90px] flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("home")}
          className="flex items-center"
        >
          <h1 className="text-[32px] font-light tracking-tight">
            <span className="text-black">Cred</span>
            <span className="text-blue-500">Root</span>
          </h1>
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <ul className="flex items-center gap-8 text-[17px] text-gray-800">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="hover:text-blue-600 transition duration-200"
                >
                  {item.label}
                </button>
              </li>
            ))}

            {/* <li>
              <button className="flex items-center gap-1 hover:text-blue-600 transition">
                More
                <IoChevronDownOutline />
              </button>
            </li> */}
          </ul>

          {/* Auth Section */}
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span className="font-medium text-gray-800">
                  {user?.name || "User"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 border border-blue-600 text-black rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoMdClose /> : <IoMdMenu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <ul className="flex flex-col">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-6 py-4 border-b hover:bg-gray-50"
                >
                  {item.label}
                </button>
              </li>
            ))}

            <li className="p-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 border rounded-lg p-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {user?.name || "User"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full bg-red-500 text-white rounded-lg py-3 hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center border border-blue-600 rounded-lg py-3 mb-3 hover:bg-blue-600 hover:text-white transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}