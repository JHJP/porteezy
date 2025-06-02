import React, { useState } from "react";
import "./App.css";
import AssetTable from "./components/AssetTable";
import AssetAnalysis from "./components/AssetAnalysis";
import LoginModal from "./components/LoginModal";
import FeedbackModal from "./components/FeedbackModal";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [tab, setTab] = useState("portfolio");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const { user, signOut } = useAuth();
  return (
    <>
      <div className="app-container">
        <header className="header">
          <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-content">
              <div className="navbar-brand">
                <div className="navbar-logo">
                  <span className="logo-text">Porteezy</span>
                </div>
                <ul className="navbar-links">
                  <li>
                    <button className={tab === "portfolio" ? "nav-link active" : "nav-link"} onClick={() => setTab("portfolio")} aria-current={tab === "portfolio" ? "page" : undefined}>
                      Portfolio
                    </button>
                  </li>
                  <li>
                    <button className={tab === "analysis" ? "nav-link active" : "nav-link"} onClick={() => setTab("analysis")} aria-current={tab === "analysis" ? "page" : undefined}>
                      Asset Analysis
                    </button>
                  </li>
                </ul>
              </div>
              <div className="navbar-right">
                {user ? (
                  <div className="user-profile-bar">
                    <div className="user-profile">
                      <div className="user-avatar">
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="user-details">
                        <span className="user-email">{user.email}</span>
                        <button className="sign-out-btn" onClick={signOut}>
                          Sign Out
                        </button>
                      </div>
                    </div>
                    <button className="feedback-btn-navbar" onClick={() => setShowFeedbackModal(true)}>Feedback</button>
                  </div>
                ) : (
                  <>
                    <button 
                      className="sign-in-btn" 
                      onClick={() => setShowLoginModal(true)}
                      aria-label="Sign in with Google"
                    >
                      Sign In / Sign Up
                    </button>
                    <button className="feedback-btn-navbar" onClick={() => setShowFeedbackModal(true)}>Feedback</button>
                  </>
                )}
              </div>
            </div>
          </nav>
          <div className="subtitle-bar">
            <p className="subtitle">
              {tab === "portfolio"
                ? "Simple Portfolio Weighting Tool"
                : "Visualize and analyze your portfolio assets."}
            </p>
          </div>
        </header>
        <main>
          {tab === "portfolio" ? <AssetTable /> : <AssetAnalysis />}
        </main>

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
        <FeedbackModal 
          open={showFeedbackModal} 
          onClose={() => setShowFeedbackModal(false)} 
        />
        {/* TODO: src/components/FeedbackModal.js 파일에서 Supabase URL과 anon key를 입력하세요. */}
      </div>
      <footer className="footer">&copy; 2025 Porteezy</footer>
      <style jsx global>{`
        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .navbar-right {
          display: flex;
          align-items: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #4a90e2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-email {
          font-size: 0.85rem;
          color: #555;
          font-weight: 500;
        }

        .sign-out-btn, .sign-in-btn {
          background: none;
          border: none;
          color: #4a90e2;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.25rem 0;
          text-align: left;
        }

        .sign-out-btn:hover, .sign-in-btn:hover {
          text-decoration: underline;
        }

        .sign-in-btn {
          background-color: #4a90e2;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
        }

        .sign-in-btn:hover {
          background-color: #3a7bc8;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}

export default App;
