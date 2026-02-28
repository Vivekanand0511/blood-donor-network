"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestBlood() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "A+",
    hospitalName: "",
    phone: "",
    urgency: "High"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Check if the browser supports GPS
    if (!navigator.geolocation) {
      alert("Location services are not supported by your browser.");
      setLoading(false);
      return;
    }

    // 2. Grab the GPS coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // 3. Attach coordinates to the data (MongoDB needs Longitude first!)
        const completeData = {
          ...formData,
          location: {
            type: "Point",
            coordinates: [longitude, latitude] 
          }
        };

        try {
          const res = await fetch("/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(completeData),
          });

          if (res.ok) {
            // Redirect to the live feed immediately after saving
            router.push("/live-feed"); 
          } else {
            console.error("Server rejected the data");
          }
        } catch (error) {
          console.error("Error submitting request", error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error getting location", error);
        alert("You must allow location access to broadcast an emergency.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-black text-center mb-2 text-slate-800">Broadcast Emergency</h2>
        <p className="text-center text-slate-500 mb-8">Alert all nearby donors instantly.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Patient Name</label>
            <input 
              required 
              type="text" 
              className="w-full border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-red-500 transition"
              onChange={(e) => setFormData({...formData, patientName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Blood Group</label>
              <select 
                className="w-full border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-red-500 font-bold"
                onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
              >
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Urgency</label>
              <select 
                className="w-full border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-red-500 font-bold"
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
              >
                <option value="Standard">Standard</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Hospital Name & Area</label>
            <input 
              required 
              type="text" 
              placeholder="e.g., Aster CMI, Hebbal"
              className="w-full border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-red-500 transition"
              onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Attendant's WhatsApp No.</label>
            <input 
              required 
              type="tel" 
              placeholder="+91..."
              className="w-full border-2 border-slate-200 rounded-lg p-3 focus:outline-none focus:border-red-500 transition"
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition shadow-md disabled:opacity-70 mt-4"
          >
            {loading ? "Getting Location & Broadcasting..." : "Submit Emergency Request"}
          </button>
        </form>
      </div>
    </div>
  );
}