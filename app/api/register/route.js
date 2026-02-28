import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();

    const newUser = await User.create({
      name: data.name,
      phone: data.phone,
      bloodGroup: data.bloodGroup,
      location: {
        type: 'Point',
        coordinates: [data.lng, data.lat] // MongoDB requires [Longitude, Latitude]
      }
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}