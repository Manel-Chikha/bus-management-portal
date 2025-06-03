"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi"
import "./ForgotPasswordPage.css"

// URL du backend déployé sur Render
const API_URL = "https://nfc-application-latest-4.onrender.com"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Requesting password reset for:", email)

      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      })

      console.log("Reset password response status:", response.status)
      const data = await response.json()
      console.log("Reset password response data:", data)

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erreur lors de la demande")
      }

      setSuccess(true)
    } catch (err) {
      console.error("Password reset error:", err)
      setError(err.message || "Erreur lors de la demande de réinitialisation")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-message">
            <FiCheck className="success-icon" />
            <h2>Email envoyé !</h2>
            <p>
              Si votre adresse email est enregistrée, vous recevrez un lien de réinitialisation dans quelques minutes.
            </p>
            <button className="back-to-login-button" onClick={() => navigate("/login")}>
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <button className="back-button" onClick={() => navigate("/login")}>
          <FiArrowLeft /> Retour
        </button>

        <h2>Mot de passe oublié</h2>
        <p>Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Adresse email</label>
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

          <button type="submit" disabled={loading} className="reset-button">
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
