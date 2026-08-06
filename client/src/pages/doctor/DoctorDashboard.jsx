import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const DoctorDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medicineName: '',
    dosage: '',
    duration: '',
    instructions: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get('/appointments/doctor');
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    try {
      const patientId =
        selectedAppointment.patientId?._id ||
        selectedAppointment.patientId ||
        selectedAppointment.patient?._id;
      const payload = {
        appointmentId: selectedAppointment._id,
        patientId,
        diagnosis: prescriptionData.diagnosis,
        medicines: [
          {
            name: prescriptionData.medicineName,
            dosage: prescriptionData.dosage,
            duration: prescriptionData.duration,
            instructions: prescriptionData.instructions,
          },
        ],
      };

      await API.post('/doctor/prescriptions', payload);

      setMessage(`Prescription submitted and appointment completed for ${selectedAppointment.patientId?.name || selectedAppointment.patient?.name || 'patient'}.`);
      setSelectedAppointment(null);
      setPrescriptionData({ diagnosis: '', medicineName: '', dosage: '', duration: '', instructions: '' });
      fetchAppointments();
    } catch (err) {
      console.error('Failed to submit prescription:', err);
      setMessage('Failed to submit prescription. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Doctor Dashboard</h2>
          <p>Welcome, <strong>Dr. {user?.name || 'Doctor'}</strong></p>
        </div>
        <button 
          onClick={handleLogout} 
          style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      {message && <p style={{ padding: '10px', backgroundColor: '#e2f0d9', color: '#385d25', borderRadius: '4px' }}>{message}</p>}

      {/* Appointment Table */}
      <section style={{ marginBottom: '30px' }}>
        <h3>Scheduled Appointments</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p style={{ color: '#666' }}>No appointments assigned yet.</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Symptoms</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  <td>{app.patient?.name || 'N/A'}</td>
                  <td>{app.patient?.phone || 'N/A'}</td>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td>{app.symptoms}</td>
                  <td style={{ fontWeight: 'bold', color: app.status === 'Completed' ? 'green' : 'orange' }}>
                    {app.status || 'Pending'}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedAppointment(app)}
                      style={{ padding: '6px 12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Write Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Prescription Form Modal/Card */}
      {selectedAppointment && (
        <div style={{ border: '2px solid #007bff', padding: '20px', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
          <h4>Issue Prescription for {selectedAppointment.patient?.name}</h4>
          <form onSubmit={handlePrescriptionSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Diagnosis:</label>
              <input
                required
                type="text"
                placeholder="e.g. Common cold"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                value={prescriptionData.diagnosis}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Medicine Name:</label>
              <input
                required
                type="text"
                placeholder="e.g. Paracetamol"
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                value={prescriptionData.medicineName}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, medicineName: e.target.value })}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold' }}>Dosage:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 500mg"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  value={prescriptionData.dosage}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, dosage: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 'bold' }}>Duration:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 5 days"
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  value={prescriptionData.duration}
                  onChange={(e) => setPrescriptionData({ ...prescriptionData, duration: e.target.value })}
                />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold' }}>Special Instructions:</label>
              <textarea
                rows="2"
                placeholder="e.g. Drink plenty of water and rest."
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                value={prescriptionData.instructions}
                onChange={(e) => setPrescriptionData({ ...prescriptionData, instructions: e.target.value })}
              />
            </div>
            <button type="submit" style={{ padding: '10px 18px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
              Submit Prescription
            </button>
            <button type="button" onClick={() => setSelectedAppointment(null)} style={{ padding: '10px 18px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;