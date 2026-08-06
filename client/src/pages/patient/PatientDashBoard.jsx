import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const PatientDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const [appRes, prescRes] = await Promise.all([
        API.get('/appointments/patient'),
        API.get('/prescriptions/patient')
      ]);

      setAppointments(appRes.data || []);
      setPrescriptions(prescRes.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to load patient data:', err);
      setError('Failed to fetch data. Make sure server is running and you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safe renderer to handle objects/arrays/strings and avoid React child errors
  const renderMedicines = (medicines) => {
    if (!medicines) return 'N/A';

    // Array of Medicine Objects
    if (Array.isArray(medicines)) {
      return (
        <ul style={{ margin: 0, paddingLeft: '15px' }}>
          {medicines.map((med, idx) => (
            <li key={med._id || idx}>
              <strong>{med.name || med.medicineName || 'Unnamed Medicine'}</strong>
              {med.dosage ? ` (${med.dosage})` : ''}
              {med.duration ? ` - for ${med.duration}` : ''}
              {med.instructions ? `: ${med.instructions}` : ''}
            </li>
          ))}
        </ul>
      );
    }

    // Single Medicine Object
    if (typeof medicines === 'object') {
      return (
        <div>
          <strong>{medicines.name || medicines.medicineName || 'Medicine'}</strong>
          {medicines.dosage ? ` (${medicines.dosage})` : ''}
          {medicines.duration ? ` - ${medicines.duration}` : ''}
          {medicines.instructions ? `: ${medicines.instructions}` : ''}
        </div>
      );
    }

    // Plain String Fallback
    return String(medicines);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2>Patient Dashboard</h2>
          <p>Welcome back, <strong>{user?.name || 'Patient'}</strong></p>
        </div>
        <div>
          <button 
            onClick={() => navigate('/book-appointment')}
            style={{ padding: '10px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            + Book Appointment
          </button>
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </header>

      {error && (
        <p style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </p>
      )}

      {/* Section 1: Appointments */}
      <section style={{ marginBottom: '40px' }}>
        <h3>Your Appointments</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p style={{ color: '#666' }}>No upcoming appointments found. Click above to book one.</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time Slot</th>
                <th>Symptoms</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app._id}>
                  <td>Dr. {app.doctorId?.name || 'N/A'}</td>
                  <td>{app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}</td>
                  <td>{app.timeSlot || app.time || 'N/A'}</td>
                  <td>{app.symptoms}</td>
                  <td style={{ fontWeight: 'bold', color: app.status === 'Completed' ? 'green' : 'orange' }}>
                    {app.status || 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Section 2: Prescriptions */}
      <section>
        <h3>Your Prescriptions</h3>
        {loading ? (
          <p>Loading prescriptions...</p>
        ) : prescriptions.length === 0 ? (
          <p style={{ color: '#666' }}>No medical prescriptions issued yet.</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Doctor</th>
                <th>Medicines</th>
                <th>Instructions</th>
                <th>Date Issued</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((pres) => (
                <tr key={pres._id}>
                  <td>Dr. {pres.doctorId?.name || pres.doctor?.name || 'N/A'}</td>
                  
                  {/* Replaced direct object render at Line 130 with renderMedicines helper */}
                  <td>{renderMedicines(pres.medicines)}</td>
                  
                  <td>{pres.instructions || pres.notes || 'None'}</td>
                  <td>{pres.createdAt ? new Date(pres.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default PatientDashboard;