"use client";
import { useState } from "react";

export default function RegisterDonor() {
  const [formData, setFormData] = useState({ name: "", phone: "", bloodGroup: "O+" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Get User Geolocation from the browser
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // 2. Send the data to your /api/register route
        const res = await fetch("/api/register", {
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
          alert("Successfully registered as a donor!");
        } else {
          alert("Error: " + result.error);
        }
      } catch (err) {
        alert("Something went wrong connecting to the server.");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      alert("Please enable location services to register. We need it for the 5km radius feature.");
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-red-600">Register as a Donor</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="John Doe" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
          <input 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none" 
            placeholder="+91 XXXXX XXXXX" 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
            required 
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Blood Group</label>
          <select 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
            onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
          >
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition disabled:bg-red-300"
        >
          {loading ? "Capturing Location..." : "Register as Donor"}
        </button>
      </form>
    </div>
  );
}