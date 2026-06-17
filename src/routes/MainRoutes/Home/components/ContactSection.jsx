import {
  FiMapPin,
  FiMail,
  FiHash,
} from "react-icons/fi";

export default function ContactSection() {
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-[54px] font-light">
            <span className="text-[#1E88FF]">Contact</span>
          </h2>

          <div className="flex items-center justify-center mt-4">
            <div className="w-24 h-[1px] bg-gray-300" />
            <div className="w-8 h-[3px] bg-[#1E88FF]" />
            <div className="w-24 h-[1px] bg-gray-300" />
          </div>

          <p className="mt-5 text-gray-700 text-lg">
            Get in touch with us via the following channels of communications
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[420px_1fr] gap-6">
          {/* Left Card */}
          <div className="bg-white border-t-2 border-[#1E88FF] shadow-sm p-8">
            <div className="space-y-10">
              {/* Location */}
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-[#eef5ff] flex items-center justify-center">
                  <FiMapPin className="text-[#1E88FF] text-xl" />
                </div>

                <div>
                  <h3 className="text-[#1E88FF] text-2xl font-semibold">
                    Location:
                  </h3>

                  <p className="mt-2 text-gray-700 leading-8">
                    C-315, K.P. Epitome,
                    <br />
                    Nr. Siddhivinayak Tower,
                    <br />
                    Makarba, Ahmedabad - 380015,
                    Gujarat, India.
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-[#eef5ff] flex items-center justify-center">
                  <FiMail className="text-[#1E88FF] text-xl" />
                </div>

                <div>
                  <h3 className="text-[#1E88FF] text-2xl font-semibold">
                    Email:
                  </h3>

                  <p className="mt-2 text-gray-700">
                    info@credroot.com
                  </p>
                </div>
              </div>

              {/* CIN */}
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-full bg-[#eef5ff] flex items-center justify-center">
                  <FiHash className="text-[#1E88FF] text-xl" />
                </div>

                <div>
                  <h3 className="text-[#1E88FF] text-2xl font-semibold">
                    CIN:
                  </h3>

                  <p className="mt-2 text-gray-700">
                    U67100GJ2022PTC136525
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-10 overflow-hidden border">
              <iframe
                title="CredRoot Location"
                src="https://maps.google.com/maps?q=KP%20Epitome%20Ahmedabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white border-t-2 border-[#1E88FF] shadow-sm p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-gray-700">
                    Your Name
                  </label>

                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#1E88FF]"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">
                    Your Email
                  </label>

                  <input
                    type="email"
                    className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#1E88FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Subject
                </label>

                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:border-[#1E88FF]"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  Message
                </label>

                <textarea
                  rows="8"
                  className="w-full border border-gray-300 px-4 py-3 resize-none outline-none focus:border-[#1E88FF]"
                />
              </div>

              {/* Recaptcha Placeholder */}
              <div className="w-[304px] h-[78px] border bg-white flex items-center justify-center text-gray-500">
                reCAPTCHA
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="
                    bg-[#1E88FF]
                    text-white
                    px-8
                    py-3
                    rounded
                    font-medium
                    hover:bg-[#1677f2]
                    transition
                  "
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}