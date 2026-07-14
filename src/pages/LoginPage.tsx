import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';
import GlowText from '../components/ui/GlowText';
import GradientButton from '../components/ui/GradientButton';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(phone, otp);
      navigate('/dashboard');
    } catch {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="login-page">
      {/* Background glow orbs */}
      <div className="login-bg-glow orange" />
      <div className="login-bg-glow gold" />

      <div className="login-card">
        <div className="login-logo">
          <Car size={48} className="login-logo-icon" />
          <GlowText variant="gold" size="2xl" as="h1">
            LetzGo
          </GlowText>
        </div>
        <p>Admin Management Dashboard</p>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              placeholder="+8801XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ width: '100%' }}
            />
          </div>
          <GradientButton
            type="submit"
            loading={loading}
            disabled={loading}
            size="lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </GradientButton>
        </form>
      </div>
    </div>
  );
}
