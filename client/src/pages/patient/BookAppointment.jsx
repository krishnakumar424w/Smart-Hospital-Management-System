import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    symptoms: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get('/users/doctors');
        setDoctors(data);
      } catch (err) {
        setError('Failed to load doctors list.');
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/appointments', formData);
      setSuccess('Appointment booked successfully!');
      setTimeout(() => navigate('/patient-dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2>Book an Appointment</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Select Doctor:</label>
          <select
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          >
            <option value="">-- Choose a Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name} ({doc.specialization || 'General'})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Date:</label>
          <input
            type="date"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Time Slot:</label>
          <input
            type="time"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={formData.timeSlot}
            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Describe Symptoms:</label>
          <textarea
            required
            rows="4"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          />
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;