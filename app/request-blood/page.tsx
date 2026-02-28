"use client";
import { useState } from "react";

export default function RequestBlood() {
  const [formData, setFormData] = useState({ 
    patientName: "", 
    bloodGroup: "O+", 
    hospitalName: "", 
    phone: "", 
    urgency: "High" 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Grab the hospital's GPS coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch("/api/requests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...formData, 
              lat: latitude, 
              lng: longitude 
            }),
          });

          const result = await res.json();
          if (result.success) {
            alert("Emergency request broadcasted successfully!");
            // Reset the form after successful submission
            setFormData({ patientName: "", bloodGroup: "O+", hospitalName: "", phone: "", urgency: "High" });
          } else {
            alert("Error: " + result.error);
          }
        } catch (err) {
          alert("Something went wrong connecting to the server.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alert("Please enable location services so donors know where the hospital is.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Emergency Blood Request</h1>
      <p className="text-slate-600 mb-8 text-center max-w-md">
        Broadcast an urgent need. Donors in your area will be able to see this request on the live feed.
      </p>

      {/* Notice the top border styling to give it an "Emergency" feel */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md border-t-4 border-red-600">
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Patient Name</label>
          <input 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="E.g., Jane Doe" 
            value={formData.patientName}
            onChange={(e) => setFormData({...formData, patientName: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Required Blood Group</label>
          <select 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
            value={formData.bloodGroup}
            onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Hospital / Clinic Name</label>
          <input 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="E.g., City General Hospital" 
            value={formData.hospitalName}
            onChange={(e) => setFormData({...formData, hospitalName: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Contact Phone (WhatsApp)</label>
          <input 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="+91 XXXXX XXXXX" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Urgency Level</label>
          <select 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none font-semibold text-orange-700"
            value={formData.urgency}
            onChange={(e) => setFormData({...formData, urgency: e.target.value})}
          >
            <option value="Normal">Normal (Within 48 Hours)</option>
            <option value="High">High (Within 24 Hours)</option>
            <option value="Critical">Critical (Immediate Need!)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition disabled:bg-red-300"
        >
          {loading ? "Broadcasting..." : "Broadcast Emergency"}
        </button>
      </form>
    </div>
  );
}