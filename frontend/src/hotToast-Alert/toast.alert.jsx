// toastalert.jsx
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaCheckCircle } from "react-icons/fa";

export const showToast = (message) =>
  toast.success(
    message, 
    {
      duration: 5000,
      style: {
        background: '#FFFFFF',
        fontSize: '23px',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      },
      icon: <FaCheckCircle style={{ color: '#00ff00', width: '30px', height: '30px' }} />, // Custom icon
    }
  );

const ToastAlert = () => {
    return <Toaster position="top-right" reverseOrder={false} />;
};

export default ToastAlert;
