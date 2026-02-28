import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* HERO SECTION with Gradient Background */}
      <section className="relative flex-grow flex flex-col items-center justify-center px-4 py-20 bg-gradient-to-b from-red-50 via-white to-slate-100 overflow-hidden">
        {/* Decorative background blurs for a modern look */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <div className="max-w-4xl mx-auto text-center z-10">
          <span className="inline-block py-1 px-4 rounded-full bg-red-100 text-red-600 text-sm font-bold mb-6 tracking-wider uppercase shadow-sm">
            Bengaluru's Hyperlocal Network
          </span>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
            Save lives within a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
              5km radius.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            A real-time, community-driven blood donor network connecting seekers and donors instantly. No middlemen, no delays.
          </p>
          
          {/* Single Primary Call to Action */}
          <div className="flex justify-center items-center">
            <Link 
              href="/find-blood" 
              className="w-full sm:w-auto bg-red-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center"
            >
              Find Blood Near Me
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800">How The Network Works</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition duration-300">
              <div className="w-16 h-16 mx-auto bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 rotate-3">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Geo-Tagged Registration</h3>
              <p className="text-slate-600 leading-relaxed">Donors securely register with their blood group and exact GPS coordinates to create a real-time availability map.</p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition duration-300">
              <div className="w-16 h-16 mx-auto bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 -rotate-3">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Smart Radius Search</h3>
              <p className="text-slate-600 leading-relaxed">In an emergency, seekers scan their area. Our geospatial engine instantly maps donors within a 5,000-meter radius.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center p-6 rounded-2xl hover:bg-slate-50 transition duration-300">
              <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl font-black mb-6 rotate-3">
                💬
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">Instant Connection</h3>
              <p className="text-slate-600 leading-relaxed">Skip the slow built-in chats. One click opens a direct WhatsApp message to the donor to arrange the donation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EMERGENCY CTA SECTION */}
      <section className="py-20 px-4 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hospital or Patient in Critical Need?</h2>
          <p className="text-lg text-slate-400 mb-8">
            Broadcast an emergency alert to our live feed. Donors across the city can view and respond to critical shortages immediately.
          </p>
          <Link 
            href="/request-blood" 
            className="inline-block bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            Broadcast Emergency Alert
          </Link>
        </div>
      </section>
      
    </div>
  );
}