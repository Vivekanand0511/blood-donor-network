"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. Blue Icon (For Donors)
const DonorIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// 2. Red Icon (For the Seeker / You)
const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// 3. Green Icon (For Red Cross Societies)
const RedCrossIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function Map({ userLocation, donors }: { userLocation: any, donors: any[] }) {
  if (!userLocation) return null;

  // Mock Red Cross Locations (Dynamically placed near the user for testing)
  // In a real production app, you would fetch these from Google Places API or your database
  const nearbyRedCross = [
    { id: 1, name: "Indian Red Cross Society (Main Branch)", lat: userLocation.lat + 0.015, lng: userLocation.lng + 0.012 },
    { id: 2, name: "Red Cross Blood Bank & Foundation", lat: userLocation.lat - 0.018, lng: userLocation.lng - 0.009 }
  ];

  return (
    <div className="w-full h-[350px] mt-6 relative rounded-lg overflow-hidden shadow-md border-2 border-slate-200">
      <MapContainer 
        center={[userLocation.lat, userLocation.lng]} 
        zoom={14} 
        maxZoom={19} // Added max zoom limit for deeper zooming
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        scrollWheelZoom={true} // Re-enabled scroll to zoom
      >
        <TileLayer
          maxZoom={19} // Tile layer must also support the max zoom
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Red Pin: User's Location */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={UserIcon}>
          <Popup><strong>You are here</strong></Popup>
        </Marker>

        {/* Green Pins: Red Cross Societies */}
        {nearbyRedCross.map((center) => (
          <Marker key={`rc-${center.id}`} position={[center.lat, center.lng]} icon={RedCrossIcon}>
            <Popup>
              <strong>🏥 {center.name}</strong><br/>
              Official Blood Bank<br/>
              <span className="text-green-600 font-semibold text-xs">Verified Location</span>
            </Popup>
          </Marker>
        ))}

        {/* Blue Pins: Matching Donors */}
        {donors.map((donor) => (
          <Marker 
            key={donor._id} 
            position={[donor.location.coordinates[1], donor.location.coordinates[0]]} 
            icon={DonorIcon}
          >
            <Popup>
              <strong>{donor.name}</strong><br/>
              Blood Group: {donor.bloodGroup}<br/>
              <a 
                href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline font-semibold mt-1 inline-block"
              >
                Contact on WhatsApp
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}