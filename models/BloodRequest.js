import mongoose from 'mongoose';

const BloodRequestSchema = new mongoose.Schema({
  patientName: { 
    type: String, 
    required: [true, 'Patient name is required'] 
  },
  bloodGroup: { 
    type: String, 
    required: true, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
  },
  hospitalName: { 
    type: String, 
    required: [true, 'Hospital or clinic name is required'] 
  },
  phone: { 
    type: String, 
    required: [true, 'Contact phone number is required'] 
  },
  urgency: {
    type: String,
    enum: ['Normal', 'High', 'Critical'],
    default: 'High'
  },
  status: {
    type: String,
    enum: ['Pending', 'Fulfilled'],
    default: 'Pending' // Changes to Fulfilled once a donor is found
  },
  // We keep geospatial data so we can map these emergencies later!
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Geospatial index so we can find requests near a specific donor
BloodRequestSchema.index({ location: "2dsphere" });

export default mongoose.models.BloodRequest || mongoose.model('BloodRequest', BloodRequestSchema);