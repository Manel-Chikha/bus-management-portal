"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { FiCheck, FiX, FiEye, FiEyeOff } from "react-icons/fi"
import "./ResetPasswordPage.css"

// URL du backend déployé sur Render
const API_URL = "https://nfc-application-latest-4.onrender.com"

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    console.log("ResetPasswordPage mounted")
    console.log("Token from URL:", token)

    if (!token) {
      console.log("No token found, redirecting to login")
      setError("Token manquant. Veuillez demander un nouveau lien de réinitialisation.")
      setTimeout(() => navigate("/login"), 3000)
    }
  }, [token, navigate])

  const validatePassword = () => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères"
    }
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule"
    }
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre"
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un caractère spécial"
    }
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!token) {
      setError("Token manquant")
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    const passwordError = validatePassword()
    if (passwordError) {
      setError(passwordError)
      return
    }

    try {
      setLoading(true)
      console.log("Attempting password reset with token:", token)

      const response = await fetch(`${API_URL}/api/auth/complete-reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: token,
          newPassword: password,
          confirmPassword: confirmPassword,
        }),
      })

      console.log("Reset response status:", response.status)
      const data = await response.json()
      console.log("Reset response data:", data)

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erreur lors de la réinitialisation")
      }

      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      console.error("Reset password error:", err)
      setError(err.message || "Une erreur s'est produite lors de la réinitialisation")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="reset-success-container">
        <div className="success-message">
          <FiCheck className="success-icon" />
          <h2>Mot de passe mis à jour avec succès!</h2>
          <p>Vous allez être redirigé vers la page de connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <button className="close-button" onClick={() => navigate("/login")}>
          <FiX />
        </button>

        <h2>Réinitialisation du mot de passe</h2>
        <p>Veuillez entrer votre nouveau mot de passe</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
                placeholder="Minimum 8 caractères"
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
            <div className="password-hints">
              <span className={password.length >= 8 ? "valid" : ""}>• 8 caractères minimum</span>
              <span className={/[A-Z]/.test(password) ? "valid" : ""}>• 1 majuscule</span>
              <span className={/[0-9]/.test(password) ? "valid" : ""}>• 1 chiffre</span>
              <span className={/[^A-Za-z0-9]/.test(password) ? "valid" : ""}>• 1 caractère spécial</span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="8"
                placeholder="Retapez votre mot de passe"
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {confirmPassword && (
              <div className="password-match">
                {password === confirmPassword ? (
                  <span className="match">
                    <FiCheck /> Les mots de passe correspondent
                  </span>
                ) : (
                  <span className="no-match">
                    <FiX /> Les mots de passe ne correspondent pas
                  </span>
                )}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading || !token} className="submit-button">
            {loading ? "En cours..." : "Réinitialiser"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
