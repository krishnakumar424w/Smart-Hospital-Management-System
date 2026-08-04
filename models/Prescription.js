import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [
    {
      name: { type: String, required: true },
      dosage: { type: String, required: true }, // e.g., "1-0-1"
      duration: { type: String, required: true }, // e.g., "5 days"
      instructions: { type: String } // e.g., "After meal"
    }
  ],
  diagnosis: { type: String, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', prescriptionSchema);