"use client";

import { useState, FormEvent } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        setError("Incorrect login or password");
      }
    } catch {
      setError("Incorrect login or password");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{ backgroundColor: "#FAF9F7", minHeight: "100vh" }}
      className="flex items-center justify-center"
    >
      <div style={{ position: "fixed", top: "1.5rem", left: "1.5rem" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 500,
            color: "#1A1A1A",
            letterSpacing: "-0.3px",
          }}
        >
          Fluent
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#999",
            marginTop: "4px",
          }}
        >
          Sign in to continue
        </div>
      </div>

      <div
        style={{
          borderRadius: "14px",
          border: "0.5px solid #D0C9C0",
          padding: "1.75rem",
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#FFFFFF",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="username"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "#888",
                letterSpacing: "0.04em",
                marginBottom: "6px",
              }}
            >
              LOGIN
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Enter your login"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={submitting}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                border: "0.5px solid #D0C9C0",
                padding: "0 14px",
                fontSize: "15px",
                color: "#1A1A1A",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#DA7756")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#D0C9C0")}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "#888",
                letterSpacing: "0.04em",
                marginBottom: "6px",
              }}
            >
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                border: "0.5px solid #D0C9C0",
                padding: "0 14px",
                fontSize: "15px",
                color: "#1A1A1A",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#DA7756")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#D0C9C0")}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: submitting ? "#c8664a" : "#DA7756",
              color: "#FFFFFF",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = "#c8664a";
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = "#DA7756";
            }}
          >
            {submitting ? "Signing in\u2026" : "Sign in"}
          </button>

          {error && (
            <p
              style={{
                fontSize: "13px",
                color: "#999",
                textAlign: "center",
                marginTop: "12px",
              }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
