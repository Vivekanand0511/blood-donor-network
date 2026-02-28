import dbConnect from '@/lib/db';
import BloodRequest from '@/models/BloodRequest';
import { NextResponse } from 'next/server';

// POST: Create a new emergency blood request
export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const newRequest = await BloodRequest.create({
      patientName: data.patientName,
      bloodGroup: data.bloodGroup,
      hospitalName: data.hospitalName,
      phone: data.phone,
      urgency: data.urgency || 'High',
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat] // GeoJSON strictly requires [Longitude, Latitude]
      }
    });

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Emergency Request Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// GET: Fetch all active (Pending) emergency requests
export async function GET() {
  try {
    await dbConnect();
    
    // We only want to find requests that haven't been fulfilled yet
    // and sort them by newest first
    const activeRequests = await BloodRequest.find({ status: 'Pending' }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, requests: activeRequests }, { status: 200 });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}