import dbConnect from '@/lib/db';
import BloodRequest from '@/models/BloodRequest';
import { NextResponse } from 'next/server';

// POST: This catches the data from your new Request form and saves it to MongoDB
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Create and save the new emergency to the database
    const newRequest = await BloodRequest.create(body);
    
    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Database Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: This pulls all emergencies from MongoDB to show on your Live Feed
export async function GET() {
  try {
    await dbConnect();
    
    // Find all requests and sort them by newest first
    const requests = await BloodRequest.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}