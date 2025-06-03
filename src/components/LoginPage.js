"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import TwoFactorAuth from "./TwoFactorAuth"
import "./LoginPage.css"

// CORRECTION : Utiliser l'URL correcte du backend
const API_URL = "https://nfc-application-latest-4.onrender.com"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("=== LOGIN DEBUG ===")
      console.log("API_URL:", API_URL)
      console.log("Attempting login with:", { email: email.trim(), password: "***" })
      console.log("Full URL:", `${API_URL}/api/auth/login`)

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      const responseText = await response.text()
      console.log("Raw response:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError)
        throw new Error("Réponse serveur invalide")
      }

      console.log("Parsed response data:", data)

      if (!response.ok) {
        console.error("Login failed with status:", response.status)
        throw new Error(data.message || `Erreur ${response.status}`)
      }

      if (data.requires2FA) {
        setUserEmail(email)
        setShow2FA(true)
      } else {
        localStorage.setItem("token", data.token)
        localStorage.setItem("userRole", data.role)
        localStorage.setItem("userName", data.name)
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("=== LOGIN ERROR ===")
      console.error("Error details:", err)
      console.error("Error message:", err.message)
      setError(err.message || "Erreur de connexion au serveur")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (email, code) => {
    try {
      console.log("Verifying 2FA for:", email, "with code:", code)

      const response = await fetch(`${API_URL}/api/auth/verify-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: code,
        }),
      })

      console.log("2FA response status:", response.status)
      const data = await response.json()
      console.log("2FA response data:", data)

      if (!response.ok) {
        throw new Error(data.message || "Code invalide")
      }

      // Sauvegarde des données utilisateur
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", data.role)
      localStorage.setItem("userName", data.name)
      localStorage.setItem("userEmail", data.email)
      if (data.segment) {
        localStorage.setItem("userSegment", data.segment)
      }

      // Redirection selon le rôle
      if (data.role === "ADMIN") {
        navigate("/admin-dashboard")
      } else if (data.role === "PRODUCER") {
        navigate("/producer-dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("2FA verification error:", err)
      throw err
    }
  }

  const handleBack2FA = () => {
    setShow2FA(false)
    setUserEmail("")
  }

  if (show2FA) {
    return <TwoFactorAuth email={userEmail} onBack={handleBack2FA} onVerify={handleVerify2FA} />
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>
        <p>Connectez-vous à votre compte</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <div className="input-container">
              <FiMail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-container">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => navigate("/forgot-password")}
            disabled={loading}
          >
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
