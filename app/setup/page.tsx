"use client";

import { useState, useEffect, FormEvent } from "react";

export default function SetupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/setup-status")
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          window.location.href = "/login";
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        setChecking(false);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        window.location.href = "/login";
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <div
        style={{ backgroundColor: "#FAF9F7", minHeight: "100vh" }}
        className="flex items-center justify-center"
      />
    );
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
          Create your account
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
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                marginBottom: "6px",
              }}
            >
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Choose a username"
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
                textTransform: "uppercase",
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
            {submitting ? "Creating\u2026" : "Create account"}
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
