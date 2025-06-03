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
    <>
      <div className="feedback-modal-backdrop">
        <div className="feedback-modal-content">
          <div className="feedback-modal-header">
            <h2 className="feedback-modal-title">피드백 보내기</h2>
            <button
              onClick={onClose}
              type="button"
              aria-label="닫기"
              className="feedback-modal-close"
            >
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="feedback-modal-radios">
              <label className="feedback-modal-radio-label">
                <input
                  className="feedback-modal-radio"
                  type="radio"
                  value="오류"
                  checked={type === "오류"}
                  onChange={() => setType("오류")}
                /> 오류
              </label>
              <label className="feedback-modal-radio-label">
                <input
                  className="feedback-modal-radio"
                  type="radio"
                  value="개선사항 제안"
                  checked={type === "개선사항 제안"}
                  onChange={() => setType("개선사항 제안")}
                /> 개선사항 제안
              </label>
            </div>
            <div className="feedback-modal-textarea-wrap">
              <textarea
                className="feedback-modal-textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="상세 설명을 입력해주세요."
                rows={6}
                required
              />
            </div>
            {(error || success) && (
              <div className={`feedback-modal-message ${error ? 'error' : 'success'}`}>
                {error || (success && "소중한 피드백 감사합니다. 빠른 시일 내 검토 후 반영하겠습니다.")}
              </div>
            )}
            <div className="feedback-modal-buttons">
              <button
                type="button"
                onClick={onClose}
                className="feedback-modal-btn feedback-modal-cancel"
              >취소</button>
              <button
                type="submit"
                disabled={loading}
                className="feedback-modal-btn feedback-modal-submit"
              >{loading ? "전송 중..." : "전송"}</button>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        .feedback-modal-backdrop {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(30,41,59,0.45);
        backdrop-filter: blur(3px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .feedback-modal-content {
        background: #fff;
        padding: 32px 24px 24px 24px;
        border-radius: 16px;
        min-width: 320px;
        max-width: 400px;
        width: 90vw;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        position: relative;
      }
      .feedback-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }
      .feedback-modal-title {
        margin: 0;
        font-size: 22px;
        font-weight: 700;
        color: #222;
      }
      .feedback-modal-close {
        background: none;
        border: none;
        font-size: 22px;
        cursor: pointer;
        color: #888;
        font-weight: 700;
        padding: 0;
        margin-left: 8px;
      }
      .feedback-modal-radios {
        margin-bottom: 18px;
        display: flex;
        gap: 24px;
      }
      .feedback-modal-radio-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-weight: 500;
        color: #333;
        font-size: 16px;
      }
      .feedback-modal-radio {
        accent-color: #2563eb;
        width: 18px; height: 18px;
      }
      .feedback-modal-textarea-wrap {
        margin-bottom: 16px;
      }
      .feedback-modal-textarea {
        width: 100%;
        padding: 12px 10px;
        border-radius: 8px;
        border: 1.5px solid #cbd5e1;
        font-size: 15px;
        resize: vertical;
        outline: none;
        transition: border 0.2s;
        box-sizing: border-box;
      }
      .feedback-modal-textarea:focus {
        border: 1.5px solid #2563eb;
      }
      .feedback-modal-message {
        margin-bottom: 14px;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 15px;
      }
      .feedback-modal-message.error {
        background: #fee2e2;
        color: #b91c1c;
      }
      .feedback-modal-message.success {
        background: #dcfce7;
        color: #15803d;
      }
      .feedback-modal-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .feedback-modal-btn {
        border: none;
        border-radius: 6px;
        padding: 9px 18px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s;
      }
      .feedback-modal-cancel {
        background: #f1f5f9;
        color: #222;
      }
      .feedback-modal-cancel:hover {
        background: #e2e8f0;
      }
      .feedback-modal-submit {
        background: #2563eb;
        color: #fff;
        font-weight: 600;
      }
      .feedback-modal-submit:disabled {
        background: #93c5fd;
        cursor: not-allowed;
      }
      .feedback-modal-submit:not(:disabled):hover {
        background: #1d4ed8;
      }
      /* 모바일 대응 */
      @media (max-width: 600px) {
        .feedback-modal-content {
          min-width: unset;
          max-width: 96vw;
          width: 96vw;
          padding: 20px 8px 16px 8px;
          border-radius: 10px;
        }
        .feedback-modal-title {
          font-size: 18px;
        }
        .feedback-modal-radio-label {
          font-size: 15px;
        }
        .feedback-modal-textarea {
          font-size: 14px;
        }
        .feedback-modal-btn {
          font-size: 14px;
          padding: 8px 12px;
        }
      }
    `}</style>
    </>
  );
};

export default FeedbackModal;
