"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Map to prevent Server-Side Rendering errors
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

export default function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState("B+");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);

  const handleSearch = () => {
    setLoading(true);
    setSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLoc({ lat: latitude, lng: longitude }); // Save location for the map

        try {
          const res = await fetch(`/api/search?lat=${latitude}&lng=${longitude}&bloodGroup=${encodeURIComponent(bloodGroup)}`);
          const data = await res.json();

          if (data.success) {
            setDonors(data.donors);
          } else {
            alert("Error: " + data.error);
          }
        } catch (err) {
          alert("Something went wrong connecting to the server.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        alert("Please enable location services so we can find donors near you.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="flex flex-col items-center p-8 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Find Blood Nearby</h1>
      <p className="text-slate-600 mb-8">Searching within a 5km radius</p>

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block text-sm font-medium mb-2">Required Blood Group</label>
        <select 
          className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-red-500 outline-none"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
        >
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <button 
          onClick={handleSearch} 
          disabled={loading}
          className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition disabled:bg-red-300"
        >
          {loading ? "Scanning Area..." : "Search for Donors"}
        </button>
      </div>

      {/* Render the Map and Results only after searching */}
      {searched && !loading && (
        <div className="w-full max-w-xl mt-8">
          <h2 className="text-xl font-bold mb-4 text-slate-800 text-center">
            {donors.length > 0 ? `${donors.length} Donor(s) Found` : "No donors found nearby."}
          </h2>
          
          {userLoc && <Map userLocation={userLoc} donors={donors} />}
        </div>
      )}
    </div>
  );
}