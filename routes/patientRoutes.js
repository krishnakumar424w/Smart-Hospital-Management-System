import express from 'express';
import { 
  bookAppointment, 
  getMyAppointments, 
  getMyPrescriptions, 
  createMedicineReminder 
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Book a new appointment
router.post('/appointments', protect, authorizeRoles('patient'), bookAppointment);

// Get patient's appointments (matches API.get('/appointments/patient'))
router.get('/appointments/patient', protect, authorizeRoles('patient'), getMyAppointments);

// Get patient's prescriptions (matches API.get('/prescriptions/patient'))
router.get('/prescriptions/patient', protect, authorizeRoles('patient'), getMyPrescriptions);

// Create medicine reminder
router.post('/reminders', protect, authorizeRoles('patient'), createMedicineReminder);

export default router;