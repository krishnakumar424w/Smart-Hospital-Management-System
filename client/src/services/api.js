import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);

// Patient
export const bookAppointment = (data) => API.post('/patient/appointments', data);
export const getMyAppointments = () => API.get('/patient/appointments');
export const getMyPrescriptions = () => API.get('/patient/prescriptions');

// Doctor
export const getDoctorAppointments = () => API.get('/doctor/appointments');
export const createPrescription = (data) => API.post('/doctor/prescriptions', data);

export default API;