"use client";
import { useState, useEffect } from "react";

export default function LiveFeed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the active requests as soon as the page loads
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests");
        const data = await res.json();
        
        if (data.success) {
          setRequests(data.requests);
        }
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Helper function to color-code the urgency levels
  const getUrgencyStyle = (urgency: string) => {
    if (urgency === 'Critical') return 'bg-red-100 border-red-600 text-red-800 animate-pulse';
    if (urgency === 'High') return 'bg-orange-100 border-orange-500 text-orange-800';
    return 'bg-blue-100 border-blue-500 text-blue-800';
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Live Emergencies</h1>
      <p className="text-slate-600 mb-8">Current patients in need of urgent blood donations.</p>

      {loading ? (
        <p className="text-lg font-semibold animate-bounce text-slate-500">Loading active requests...</p>
      ) : requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500 w-full max-w-2xl text-center">
          <h2 className="text-xl font-bold text-slate-800">No active emergencies right now.</h2>
          <p className="text-slate-600 mt-2">Check back later or register as a donor in the meantime.</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6">
          {requests.map((req: any) => (
            <div 
              key={req._id} 
              className={`p-6 rounded-lg shadow-md border-l-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${getUrgencyStyle(req.urgency)}`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-black">{req.bloodGroup}</span>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-white rounded-full bg-opacity-50">
                    {req.urgency} NEED
                  </span>
                </div>
                <h3 className="text-lg font-bold">Patient: {req.patientName}</h3>
                <p className="text-sm font-medium mt-1">🏥 {req.hospitalName}</p>
                <p className="text-xs mt-2 opacity-80">
                  Posted: {new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>

              <a 
                href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-auto text-center bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition shadow-sm"
              >
                Contact Hospital / Family
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}