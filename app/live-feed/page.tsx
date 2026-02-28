"use client";
import { useState, useEffect } from "react";

export default function LiveFeed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests");
        const data = await res.json();
        if (data.success) setRequests(data.requests);
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getUrgencyStyle = (urgency: string) => {
    if (urgency === 'Critical') return 'bg-red-100 border-red-600 text-red-800 animate-pulse';
    if (urgency === 'High') return 'bg-orange-100 border-orange-500 text-orange-800';
    return 'bg-blue-100 border-blue-500 text-blue-800';
  };

  // NEW: Function to generate the WhatsApp Share Link
  const handleShare = (req: any) => {
    const message = encodeURIComponent(
      `🚨 *URGENT BLOOD REQUIREMENT* 🚨\n\n` +
      `*Patient:* ${req.patientName}\n` +
      `*Blood Group:* ${req.bloodGroup}\n` +
      `*Hospital:* ${req.hospitalName}\n` +
      `*Urgency:* ${req.urgency}\n\n` +
      `If you can donate, please contact: ${req.phone}\n\n` +
      `View more details here: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Live Emergencies</h1>
      <p className="text-slate-600 mb-8">Current patients in need of urgent blood donations.</p>

      {loading ? (
        <p className="text-lg font-semibold animate-bounce text-slate-500">Loading...</p>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {requests.map((req: any) => (
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
                
                {/* Contact Button */}
                <a 
                  href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                >
                  Contact
                </a>
              </div>

              {/* NEW: Share Button */}
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