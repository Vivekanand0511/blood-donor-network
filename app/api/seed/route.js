import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

// Real-world blood groups and some common Indian names for realistic testing
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const firstNames = ['Amit', 'Priya', 'Rahul', 'Neha', 'Vikram', 'Anjali', 'Karthik', 'Pooja', 'Suresh', 'Divya', 'Syed', 'Aisha'];
const lastNames = ['Sharma', 'Gowda', 'Patil', 'Kumar', 'Singh', 'Reddy', 'Iyer', 'Menon', 'Das', 'Rao'];

// Center Coordinates: Bengaluru (Roughly around Vidhana Soudha/Cubbon Park)
// Latitude: 12.9716, Longitude: 77.5946
const centerLat = 12.9716;
const centerLng = 77.5946;

export async function GET() {
  try {
    await dbConnect();
    
    // Optional: Clear existing users so you have a clean slate (uncomment if you want to wipe the DB first)
    // await User.deleteMany({});

    const dummyDonors = [];

    for (let i = 0; i < 50; i++) {
      // 1. Generate random name and blood group
      const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const bg = bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
      
      // 2. Generate a fake Indian phone number
      const phone = `+9198${Math.floor(10000000 + Math.random() * 90000000)}`;

      // 3. Generate random coordinates within roughly a 5-10km radius of the center
      // We do this by adding/subtracting a tiny random decimal to the lat and lng
      const lat = centerLat + (Math.random() - 0.5) * 0.1;
      const lng = centerLng + (Math.random() - 0.5) * 0.1;

      // 4. Push to our array
      dummyDonors.push({
        name,
        phone,
        bloodGroup: bg,
        location: {
          type: 'Point',
          coordinates: [lng, lat] // MongoDB strict rule: Longitude always comes first!
        }
      });
    }

    // 5. Insert all 50 donors into MongoDB at once
    await User.insertMany(dummyDonors);

    return NextResponse.json({ 
      success: true, 
      message: "Successfully injected 50 realistic donors into the database!" 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}