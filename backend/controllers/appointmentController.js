import Appointment from '../models/Appointment.js';

// @desc Create new appointment
// @route POST /api/appointments
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, timeSlot, symptoms } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user._id, // Populated from protect middleware
      doctorId,
      date,
      timeSlot,
      symptoms,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get appointments for logged in patient
// @route GET /api/appointments/patient
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name email specialization')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get appointments for logged in doctor
// @route GET /api/appointments/doctor
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name email phone age gender')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};