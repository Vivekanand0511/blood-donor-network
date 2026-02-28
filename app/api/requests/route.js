import dbConnect from '@/lib/db';
import BloodRequest from '@/models/BloodRequest';
import { NextResponse } from 'next/server';

// POST: Catches data from the Request form and saves it to MongoDB
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const newRequest = await BloodRequest.create(body);
    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("Database Save Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// GET: Pulls all emergencies from MongoDB to show on your Live Feed
export async function GET() {
  try {
    await dbConnect();
    const requests = await BloodRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    console.error("Database Fetch Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// NEW DELETE: Removes a resolved emergency from the database
export async function DELETE(req) {
  try {
    await dbConnect();
    // Grab the ID from the URL (e.g., /api/requests?id=123)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "No ID provided" }, { status: 400 });
    }

    await BloodRequest.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Request resolved and deleted" }, { status: 200 });
  } catch (error) {
    console.error("Database Delete Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}