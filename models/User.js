import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide a name'] 
  },
  bloodGroup: { 
    type: String, 
    required: true, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
  },
  phone: { 
    type: String, 
    required: [true, 'Phone number is required'] 
  },
  lastDonationDate: { 
    type: Date, 
    default: null 
  },
  
  // Geospatial data for the 5km radius search
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

// IMPORTANT: This allows us to use $near queries for proximity
UserSchema.index({ location: "2dsphere" });

export default mongoose.models.User || mongoose.model('User', UserSchema);