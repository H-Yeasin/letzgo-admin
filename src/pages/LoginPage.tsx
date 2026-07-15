import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car } from 'lucide-react';
import GlowText from '../components/ui/GlowText';
import GradientButton from '../components/ui/GradientButton';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only the 10-digit local part: strip non-digits, a pasted 880
    // country code, and any leading 0 (+880 prefix already covers both)
    let digits = e.target.value.replace(/\D/g, '');
    if (digits.startsWith('880') && digits.length > 10) digits = digits.slice(3);
    setPhone(digits.replace(/^0+/, '').slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login('880' + phone, password);
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
            <div className="phone-input-group">
              <span className="phone-prefix">+880</span>
              <input
                type="tel"
                inputMode="numeric"
                autoComplete="username"
                placeholder="1XXXXXXXXX"
                value={phone}
                onChange={handlePhoneChange}
                pattern="[0-9]{10}"
                title="10-digit number after +880 (without the leading 0)"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
