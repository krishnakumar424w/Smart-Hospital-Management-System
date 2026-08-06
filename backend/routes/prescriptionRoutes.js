import express from 'express';
import Prescription from '../models/Prescription.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create prescription (Doctor only)
router.post('/', protect, async (req, res) => {
  try {
    const { appointmentId, patientId, medicines, instructions } = req.body;
    const prescription = await Prescription.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: req.user._id,
      medicines,
      instructions,
    });
    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  }
});

// Fetch patient's prescriptions
router.get('/patient', protect, async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id }).populate('doctorId', 'name');
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
});

export default router;
