import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo / Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-red-600 tracking-tighter">
              Blood<span className="text-slate-800">Network</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/find-blood" className="text-slate-600 hover:text-red-600 font-medium transition">
              Find Blood
            </Link>
            
            <Link href="/live-feed" className="text-slate-600 hover:text-red-600 font-medium transition flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Feed
            </Link>

            <Link href="/request-blood" className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 rounded-md font-bold transition border border-orange-200">
              Request Blood
            </Link>
            
            <Link href="/register" className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md font-bold transition shadow-sm">
              Become a Donor
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}