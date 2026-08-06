import Appointment from '../models/Appointment.js';
import Prescription from '../models/Prescription.js';

// @desc Get Doctor Appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name age gender phone bloodGroup')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add Prescription
export const createPrescription = async (req, res) => {
  const { appointmentId, patientId, medicines, diagnosis, notes } = req.body;
  try {
    const prescription = await Prescription.create({
      appointmentId,
      doctorId: req.user._id,
      patientId,
      medicines,
      diagnosis,
      notes
    });

    // Mark appointment as Completed
    await Appointment.findByIdAndUpdate(appointmentId, { status: 'Completed' });

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
