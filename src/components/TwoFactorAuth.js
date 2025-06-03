// src/components/TwoFactorAuth.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiArrowLeft, FiCheck } from 'react-icons/fi';
import './TwoFactorAuth.css';

const TwoFactorAuth = ({ email, onBack, onVerify }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
      const [resendLoading, setResendLoading] = useState(false); // Nouvel état pour le chargement du renvoi

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Veuillez entrer un code valide à 6 chiffres');
      return;
    }

    setLoading(true);
    try {
      await onVerify(email, code);
    } catch (err) {
      setError(err.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };
// Dans TwoFactorAuth.js
const handleResendCode = async () => {
  setError('');
  try {
    const response = await fetch('https://bus-management-portal.onrender.com/api/auth/resend-2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la demande de nouveau code');
    }

    setError('Nouveau code envoyé avec succès');
  } catch (err) {
    setError(err.message || 'Erreur lors de la demande de nouveau code');
  }
};

// Mettez à jour le bouton Renvoyer dans le JSX:
  return (
    <div className="two-factor-container">
      <div className="two-factor-card">
        <button className="back-button" onClick={onBack}>
          <FiArrowLeft /> Retour
        </button>

        <h2>Vérification en deux étapes</h2>
        <p>Nous avons envoyé un code à 6 chiffres à <strong>{email}</strong></p>

{error && (
  error.toLowerCase().includes('succès') ? (
    <div className="success-message">{error}</div>
  ) : (
    <div className="error-message">{error}</div>
  )
)}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Code de vérification</label>
            <input
              type="text"
              value={code}
  onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              placeholder="123456"
              required
              autoFocus
              disabled={loading || resendLoading}
            />
          </div>

          <button type="submit"
           disabled={loading || resendLoading}
            className="verify-button">

            {loading ? 'Vérification...' : (
              <>
                <FiCheck /> Vérifier
              </>
            )}
          </button>
        </form>

        <div className="resend-note">
                  <p>
                    Vous n'avez pas reçu le code ?
                    <button
                      type="button"
                      className="resend-link"
                      onClick={handleResendCode}
                      disabled={resendLoading}
                    >
                      {resendLoading ? 'Envoi en cours...' : 'Renvoyer'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
  );
};

export default TwoFactorAuth;
