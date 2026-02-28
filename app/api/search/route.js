import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    
    // Grab the search parameters from the URL
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat'));
    const lng = parseFloat(searchParams.get('lng'));
    const bloodGroup = searchParams.get('bloodGroup');

    // Make sure we have all the info we need
    if (!lat || !lng || !bloodGroup) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // The Magic: MongoDB $near query
    const donors = await User.find({
      bloodGroup: bloodGroup, // Match the exact blood group
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat] // Remember: Longitude always comes first!
          },
          $maxDistance: 5000 // 5000 meters = 5km radius
        }
      }
    });

    return NextResponse.json({ success: true, donors }, { status: 200 });
    
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}