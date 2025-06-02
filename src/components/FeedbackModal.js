import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = "https://rtggjeovfdfausxqbjqm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Z2dqZW92ZmRmYXVzeHFianFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4ODM3NzYsImV4cCI6MjA2NDQ1OTc3Nn0.rdI2xYr2B2QSiJlT4sSvsO0V9XUms_wDYQ7u2nAlMXU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const FeedbackModal = ({ open, onClose }) => {
  const [type, setType] = useState("오류");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const { error } = await supabase.from("feedback").insert([
      { type, description }
    ]);
    setLoading(false);
    if (error) {
      setError("전송에 실패했습니다. 다시 시도해 주세요.");
    } else {
      setSuccess(true);
      setDescription("");
      setType("오류");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(30, 41, 59, 0.45)",
      backdropFilter: "blur(3px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        padding: "32px 24px 24px 24px",
        borderRadius: 16,
        minWidth: 340,
        maxWidth: 400,
        width: "90vw",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#222" }}>피드백 보내기</h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="닫기"
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#888",
              fontWeight: 700,
              padding: 0,
              marginLeft: 8
            }}
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Radio buttons */}
          <div style={{ marginBottom: 18, display: "flex", gap: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500, color: "#333" }}>
              <input
                type="radio"
                value="오류"
                checked={type === "오류"}
                onChange={() => setType("오류")}
                style={{ accentColor: "#2563eb", width: 18, height: 18 }}
              /> 오류
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 500, color: "#333" }}>
              <input
                type="radio"
                value="개선사항 제안"
                checked={type === "개선사항 제안"}
                onChange={() => setType("개선사항 제안")}
                style={{ accentColor: "#2563eb", width: 18, height: 18 }}
              /> 개선사항 제안
            </label>
          </div>
          {/* Textarea */}
          <div style={{ marginBottom: 16 }}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="상세 설명을 입력해주세요."
              rows={6}
              style={{
                width: "100%",
                padding: "12px 10px",
                borderRadius: 8,
                border: "1.5px solid #cbd5e1",
                fontSize: 15,
                resize: "vertical",
                outline: "none",
                transition: "border 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={e => e.target.style.border = "1.5px solid #2563eb"}
              onBlur={e => e.target.style.border = "1.5px solid #cbd5e1"}
              required
            />
          </div>
          {/* Error/Success message */}
          {(error || success) && (
            <div style={{
              marginBottom: 14,
              padding: "8px 12px",
              borderRadius: 6,
              background: error ? "#fee2e2" : "#dcfce7",
              color: error ? "#b91c1c" : "#15803d",
              fontWeight: 500,
              fontSize: 15
            }}>
              {error || (success && "소중한 피드백 감사합니다. 빠른 시일 내 검토 후 반영하겠습니다.")}
            </div>
          )}
          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#f1f5f9",
                color: "#222",
                border: "none",
                borderRadius: 6,
                padding: "9px 18px",
                fontSize: 15,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 0.15s"
              }}
              onMouseOver={e => e.target.style.background = "#e2e8f0"}
              onMouseOut={e => e.target.style.background = "#f1f5f9"}
            >취소</button>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? "#93c5fd" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "9px 18px",
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.15s"
              }}
              onMouseOver={e => !loading && (e.target.style.background = "#1d4ed8")}
              onMouseOut={e => !loading && (e.target.style.background = "#2563eb")}
            >{loading ? "전송 중..." : "전송"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
