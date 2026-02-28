"use client";
import { useState, useEffect } from "react";

export default function LiveFeed() {
  // TypeScript Fix: Added <any[]> so it knows what data to expect
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [campusMode, setCampusMode] = useState(false);

  // List of hospitals near BMSIT / Yelahanka area
  const campusHospitals = ["Aster CMI", "Columbia Asia", "Manipal", "Omega", "Proactive", "Navachethana"];

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests");
        const data = await res.json();
        if (data.success) {
          setRequests(data.requests);
          setFilteredRequests(data.requests);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Handle Filtering for Campus Hospitals
  useEffect(() => {
    if (campusMode) {
      const nearCampus = requests.filter(req => 
        campusHospitals.some(h => req.hospitalName.toLowerCase().includes(h.toLowerCase()))
      );
      setFilteredRequests(nearCampus);
    } else {
      setFilteredRequests(requests);
    }
  }, [campusMode, requests]);

  const getUrgencyStyle = (urgency: string) => {
    if (urgency === 'Critical') return 'bg-red-100 border-red-600 text-red-800 animate-pulse';
    if (urgency === 'High') return 'bg-orange-100 border-orange-500 text-orange-800';
    return 'bg-blue-100 border-blue-500 text-blue-800';
  };

  const handleShare = (req: any) => {
    const message = encodeURIComponent(
      `🚨 *BLOOD EMERGENCY* 🚨\n\n` +
      `*Patient:* ${req.patientName}\n` +
      `*Blood Group:* ${req.bloodGroup}\n` +
      `*Hospital:* ${req.hospitalName}\n\n` +
      `Help a fellow member of the community. Contact: ${req.phone}\n` +
      `View on Live Feed: ${window.location.origin}/live-feed`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Live Emergencies</h1>
      
      {/* Campus Toggle Button */}
      <div className="mb-8 flex flex-col items-center">
        <button 
          onClick={() => setCampusMode(!campusMode)}
          className={`px-6 py-2 rounded-full font-bold transition-all ${campusMode ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-300'}`}
        >
          {campusMode ? "📍 Showing Near Campus" : "Show Near Campus Only"}
        </button>
        <p className="text-xs text-slate-500 mt-2">
          {campusMode ? "Filtering for Yelahanka & Hebbal hospitals" : "Showing all requests across Bengaluru"}
        </p>
      </div>

      {loading ? (
        <p className="text-lg font-semibold animate-bounce text-slate-500">Scanning Feed...</p>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-slate-500">No active emergencies found for this filter.</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {filteredRequests.map((req: any) => (
            <div key={req._id} className={`p-6 rounded-lg shadow-md border-l-8 flex flex-col gap-4 ${getUrgencyStyle(req.urgency)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black">{req.bloodGroup}</span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white rounded-full bg-opacity-50">
                      {req.urgency}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">Patient: {req.patientName}</h3>
                  <p className="text-sm font-medium">🏥 {req.hospitalName}</p>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                >
                  Contact
                </button>
              </div>
              <button 
                onClick={() => handleShare(req)}
                className="w-full border-2 border-green-600 text-green-700 py-2 rounded-lg font-bold hover:bg-green-50 flex items-center justify-center gap-2 transition"
              >
                <span>📢</span> Share Requirement on WhatsApp
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}