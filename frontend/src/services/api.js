// src/services/api.js
import axios from 'axios';
import Swal from 'sweetalert2';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// ✅ Interceptor for all API responses (shows popup automatically)
API.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase();

    // Show popup only for POST, PUT, DELETE
    if (method === 'post') {
      Swal.fire({
        icon: 'success',
        title: 'Saved Data Successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } else if (method === 'put') {
      Swal.fire({
        icon: 'success',
        title: 'Data Updated Successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    } else if (method === 'delete') {
      Swal.fire({
        icon: 'success',
        title: 'Data Deleted Successfully!',
        showConfirmButton: false,
        timer: 1500
      });
    }

    return response;
  },
  (error) => {
    // Error popup for any failed request
    Swal.fire({
      icon: 'error',
      title: 'Operation Failed!',
      text: error.response?.data?.error || 'Server Error. Please try again.',
      showConfirmButton: true
    });
    return Promise.reject(error);
  }
);

export default API;
