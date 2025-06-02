import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons

const LoginModal = ({ isOpen, onClose }) => {
  const { signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-content">
          <div className="logo-container">
            <FcGoogle size={48} />
          </div>
          <h2>Sign in to Porteezy</h2>
          <p className="subtitle">Save and manage your portfolio across devices</p>
          
          <button 
            className="google-signin-btn"
            onClick={() => {
              signInWithGoogle();
              onClose();
            }}
          >
            <FcGoogle size={20} style={{ marginRight: '10px' }} />
            Continue with Google
          </button>
          
          <p className="terms">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(3px);
        }
        .modal {
          background: white;
          padding: 2.5rem;
          border-radius: 16px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          position: relative;
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
          line-height: 1;
        }
        .logo-container {
          margin-bottom: 1.5rem;
        }
        h2 {
          margin: 0 0 0.5rem;
          color: #333;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .subtitle {
          color: #666;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        .google-signin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 0.8rem 1rem;
          background: white;
          color: #333;
          border: 1px solid #dadce0;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 1.5rem;
        }
        .google-signin-btn:hover {
          background-color: #f7f8f8;
          box-shadow: 0 1px 3px 1px rgba(66, 64, 67, 0.15);
        }
        .google-signin-btn:active {
          background-color: #f1f3f4;
        }
        .terms {
          color: #5f6368;
          font-size: 0.75rem;
          line-height: 1.4;
          margin: 1rem 0 0;
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
