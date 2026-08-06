import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';
import MedicineReminder from '../models/MedicineReminder.js';

// @desc    Book an Appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req, res) => {
  const { doctorId, date, timeSlot, symptoms } = req.body;

  if (!doctorId || !date || !timeSlot) {
    return res.status(400).json({ message: 'Doctor, date, and time slot are required.' });
  }

  try {
    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date,
      timeSlot,
      symptoms
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Appointments (Patient)
// @route   GET /api/appointments/patient
// @access  Private (Patient)
export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization phone')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get My Prescriptions (Patient)
// @route   GET /api/prescriptions/patient
// @access  Private (Patient)
export const getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization phone')
      .populate('appointmentId', 'date timeSlot symptoms status')
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Medicine Reminder
// @route   POST /api/reminders
// @access  Private (Patient)
export const createMedicineReminder = async (req, res) => {
  const { medicineName, reminderTimes, startDate, endDate } = req.body;

  if (!medicineName || !reminderTimes) {
    return res.status(400).json({ message: 'Medicine name and reminder times are required.' });
  }

  try {
    const reminder = await MedicineReminder.create({
      patientId: req.user._id,
      medicineName,
      reminderTimes,
      startDate,
      endDate
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};