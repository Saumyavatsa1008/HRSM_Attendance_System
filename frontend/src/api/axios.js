import axios from 'axios';

const api = axios.create({
  // Replace the local URL with your live Render URL
  baseURL: 'https://hrsm-attendance-system.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;