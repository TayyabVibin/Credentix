import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EmailRounded from '@mui/icons-material/EmailRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { register, clearError } from '../store/authSlice.ts';
import PageTransition from '../components/PageTransition.tsx';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }

    const result = await dispatch(register({ email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/wallet');
    }
  };

  const displayError = localError || error;

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <Card sx={{ maxWidth: 440, width: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  Credentix
                </Typography>
                <Typography color="text.secondary">
                  Create your account
                </Typography>
              </Box>

              {displayError && (
                <Alert severity="error" onClose={() => { setLocalError(''); dispatch(clearError()); }} sx={{ mb: 3 }}>
                  {displayError}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start"><EmailRounded color="action" /></InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  helperText="Must be at least 8 characters"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start"><LockRounded color="action" /></InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="Toggle password visibility">
                            {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 2.5 }}
                />
                <TextField
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start"><LockRounded color="action" /></InputAdornment>
                      ),
                    },
                  }}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>
              </form>

              <Typography sx={{ mt: 3, textAlign: 'center' }} variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
                  Sign in
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </PageTransition>
  );
}
