import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (showOtp) {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'signup',
        });
        if (error) throw error;
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
        });
        if (error) throw error;
        
        // Force show OTP screen for all signup attempts
        setShowOtp(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-light tracking-widest uppercase">
            {showOtp ? 'Verify Email' : isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          {showOtp && (
            <p className="mt-2 text-xs text-muted-foreground uppercase tracking-widest opacity-50">
              Enter the 6-digit code sent to {email}
            </p>
          )}
        </div>
        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          <div className="space-y-4">
            {!showOtp ? (
              <>
                <input
                  type="email"
                  required
                  className="w-full bg-muted border border-border px-4 py-2 text-foreground focus:outline-none focus:border-white transition-colors"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  required
                  className="w-full bg-muted border border-border px-4 py-2 text-foreground focus:outline-none focus:border-white transition-colors"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </>
            ) : (
              <input
                type="text"
                required
                className="w-full bg-muted border border-border px-4 py-2 text-foreground text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-white transition-colors"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            )}
          </div>

          {error && <p className="text-sm text-red-500 text-center font-light">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-white py-2 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : showOtp ? 'Verify' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setShowOtp(false);
              setError(null);
            }}
            className="text-xs text-muted-foreground hover:text-white transition-colors uppercase tracking-widest opacity-50"
          >
            {showOtp ? 'Back to Sign In' : isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
