import {
  FiMapPin,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";

export default function ContactSection() {
  return (
    <section className="bg-[#f8f9fc] py-16 lg:py-20">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-[36px] md:text-[48px] font-semibold text-[#111827]">
            Contact
          </h2>

          <p className="mt-2 text-[#6B7280] text-sm md:text-base">
            Get in touch with us via the following channels of communications
          </p>
        </div>

        {/* Two Separate Boxes */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-4 items-stretch">
          {/* Left Contact Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-8">
              {/* Location */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
                  <FiMapPin className="text-primary text-lg" />
                </div>

                <div>
                  <h3 className="text-primary font-semibold text-lg">
                    Location:
                  </h3>

                  <p className="mt-1 text-sm text-gray-600 leading-7">
                    C-315, K.P. Epitome,
                    <br />
                    Nr. Siddhivinayak Tower,
                    <br />
                    Makarba, Ahmedabad - 380015,
                    <br />
                    Gujarat, India.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
                  <FiMail className="text-primary text-lg" />
                </div>

                <div>
                  <h3 className="text-primary font-semibold text-lg">
                    Email:
                  </h3>

                  <p className="mt-1 text-sm text-gray-600">
                    info@credroot.com
                  </p>
                </div>
              </div>

              {/* CIN */}
<div className="flex gap-4">
  <div className="w-10 h-10 rounded-full bg-[#EEF4FF] flex items-center justify-center shrink-0">
    <HiOutlineBadgeCheck className="text-primary text-xl" />
  </div>

  <div>
    <h3 className="text-primary font-semibold text-lg">
      CIN:
    </h3>

    <p className="mt-1 text-sm text-gray-600">
      U67100GJ2022PTC136525
    </p>
  </div>
</div>
            </div>

            {/* Map */}
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
              <iframe
                title="CredRoot Location"
                src="https://maps.google.com/maps?q=KP%20Epitome%20Ahmedabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="135"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Form Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <form>
              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Your Name
                  </label>

                  <input
                    type="text"
                    className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-primary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm text-gray-700">
                    Your Email
                  </label>

                  <input
                    type="email"
                    className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="mt-4">
                <label className="block mb-2 text-sm text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  className="w-full h-11 px-4 border border-gray-300 rounded-md outline-none focus:border-primary"
                />
              </div>

              {/* Message */}
              <div className="mt-4">
                <label className="block mb-2 text-sm text-gray-700">
                  Message
                </label>

                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 resize-none outline-none focus:border-primary"
                />
              </div>

              {/* Bottom Row */}
              <div className="mt-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Recaptcha Style Box */}
                <div className="w-[302px] h-[78px] border border-gray-300 rounded bg-white flex items-center px-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mr-3 cursor-pointer"
                  />

                  <div>
                    <p className="text-sm text-gray-700">
                      I'm not a robot
                    </p>

                    <p className="text-[10px] text-gray-400">
                      reCAPTCHA
                    </p>
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="bg-primary hover:opacity-90 text-white px-8 py-3 rounded-md flex items-center justify-center gap-3 transition-all"
                >
                  Send Message
                  <FiArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}