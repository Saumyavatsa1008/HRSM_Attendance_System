import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Using IP to avoid localhost DNS lag
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
