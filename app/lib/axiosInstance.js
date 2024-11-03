// api.js or axios.js
import axios from 'axios';

// Create an Axios instance with a base URL
const api = axios.create({
  baseURL: `https://stardb-temp-api.vercel.app/api`, // Main base URL
  timeout: 10000, // Optional: Timeout for requests
  headers: {
    'Content-Type': 'application/json', // Set default headers
  },
});


export default api;
