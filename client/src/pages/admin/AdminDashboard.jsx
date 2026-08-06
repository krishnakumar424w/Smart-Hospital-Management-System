import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, patients: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      setUsers(data);

      const patients = data.filter((u) => u.role === 'patient').length;
      const doctors = data.filter((u) => u.role === 'doctor').length;
      setStats({ totalUsers: data.length, patients, doctors });
    } catch (err) {
      setError('Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await API.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
      }
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
          <h2>Admin Control Panel</h2>
          <p>Logged in as: <strong>{user?.name || 'Administrator'}</strong></p>
        </div>
        <button 
          onClick={handleLogout} 
          style={{ padding: '10px 16px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', backgroundColor: '#e8f4f8' }}>
          <h3>Patients</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{stats.patients}</p>
        </div>
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', backgroundColor: '#eafaf1' }}>
          <h3>Doctors</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>{stats.doctors}</p>
        </div>
      </div>

      {/* Manage Users */}
      <section>
        <h3>System User Directory</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{u.role}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        style={{ padding: '6px 12px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;