import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaSkype,
} from "react-icons/fa";
import { IoChevronForwardOutline } from "react-icons/io5";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Why CredRoot?", id: "why-credroot" },
    { label: "Products", id: "products" },
    { label: "FAQs", id: "faqs" },
    { label: "Contact", id: "contact" },
  ];

  const usefulLinks = [
    {
      label: "Grievance Policy",
      slug: "/grievance-policy",
    },
    {
      label: "Privacy Policy",
      slug: "/privacy-policy",
    },
    {
      label: "Fair Practice Code",
      slug: "/fair-practice-code",
    },
    {
      label: "Terms and Conditions",
      slug: "/terms-and-conditions",
    },
  ];

  const scrollToSection = (id) => {
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
    <footer className="mt-auto">
      {/* Main Footer */}
      <div className="bg-[#efefef] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">

            {/* Logo + Address */}
            <div className="text-center lg:text-left">
              <button
                onClick={() => scrollToSection("home")}
                className="inline-block mb-6 text-left"
              >
                <h2 className="text-[32px] font-medium leading-none">
                  <span className="text-black">Cred</span>
                  <span className="text-[#1E88FF]">Root</span>
                </h2>
              </button>

              <div className="text-gray-800 text-[17px] leading-9">
                <p>C-315, K.P. Epitome,</p>
                <p>Nr. Siddhivinayak Tower, Makarba,</p>
                <p>Ahmedabad - 380015,</p>
                <p>Gujarat, India.</p>

                <p className="mt-4">
                  <span className="font-semibold">Email:</span>{" "}
                  <a
                    href="mailto:info@credroot.com"
                    className="hover:text-[#1E88FF]"
                  >
                    info@credroot.com
                  </a>
                </p>
              </div>
            </div>

            {/* Other Pages */}
            <div>
              <h3 className="text-[18px] font-bold text-black mb-8">
                Other Pages
              </h3>

              <ul className="space-y-5">
                {pages.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="flex items-center gap-2 text-[17px] text-gray-600 hover:text-[#1E88FF] transition"
                    >
                      <IoChevronForwardOutline className="text-[#1E88FF]" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h3 className="text-[18px] font-bold text-black mb-8">
                Useful Links
              </h3>

              <ul className="space-y-5">
                {usefulLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.slug}
                      className="flex items-center gap-2 text-[17px] text-gray-600 hover:text-[#1E88FF] transition"
                    >
                      <IoChevronForwardOutline className="text-[#1E88FF]" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Networks */}
            <div>
              <h3 className="text-[18px] font-bold text-black mb-8">
                Our Social Networks
              </h3>

              <p className="text-[17px] text-gray-800 leading-8 mb-8">
                Follow us and get updates on latest news
                <br />
                from our Social Media handles
              </p>

              <div className="flex flex-wrap gap-4">
                <SocialIcon
                  icon={<FaTwitter />}
                  href="https://twitter.com"
                />

                <SocialIcon
                  icon={<FaFacebookF />}
                  href="https://facebook.com"
                />

                <SocialIcon
                  icon={<FaInstagram />}
                  href="https://instagram.com"
                />

                <SocialIcon
                  icon={<FaSkype />}
                  href="https://skype.com"
                />

                <SocialIcon
                  icon={<FaLinkedinIn />}
                  href="https://linkedin.com"
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black">
        <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between">
          <p className="text-white text-[17px] text-center md:text-left">
            © Copyright{" "}
            <span className="font-bold">
              CredRoot
            </span>
            . All Rights Reserved
          </p>

          {/* <p className="text-white text-[17px] mt-3 md:mt-0">
            Website Powered By{" "}
            <span className="text-[#1E88FF]">
              Werge
            </span>
          </p> */}
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        w-10 h-10
        rounded-full
        bg-[#1E88FF]
        text-white
        flex items-center justify-center
        text-lg
        hover:scale-110
        transition-all
        duration-300
      "
    >
      {icon}
    </a>
  );
}