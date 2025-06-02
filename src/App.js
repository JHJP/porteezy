import React, { useState } from "react";
import "./App.css";
import AssetTable from "./components/AssetTable";
import AssetAnalysis from "./components/AssetAnalysis";

function App() {
  const [tab, setTab] = useState("portfolio");
  return (
    <>
      <div className="app-container">
        <header className="header">
          <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-content">
              <div className="navbar-logo">
                <span className="logo-text"> Porteezy</span>
              </div>
              <ul className="navbar-links">
                <li>
                  <button className={tab === "portfolio" ? "nav-link active" : "nav-link"} onClick={() => setTab("portfolio")} aria-current={tab === "portfolio" ? "page" : undefined}>Portfolio</button>
                </li>
                <li>
                  <button className={tab === "analysis" ? "nav-link active" : "nav-link"} onClick={() => setTab("analysis")} aria-current={tab === "analysis" ? "page" : undefined}>Asset Analysis</button>
                </li>
              </ul>
              <div className="navbar-actions">
                <button className="sign-btn" aria-label="Sign in or sign up">Sign In / Sign Up</button>
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
        <button className="feedback-btn">Feedback</button>
      </div>
      <footer className="footer">&copy; 2025 Porteezy </footer>
    </>
  );
}

export default App;
