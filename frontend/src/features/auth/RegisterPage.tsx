import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import EmailRounded from '@mui/icons-material/EmailRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { register, clearError } from '../../store/authSlice';
import { PageTransition } from '../../motion';
import CredentixLogo from '../../design-system/primitives/CredentixLogo';
const stepVariant = { enter: { opacity: 0, x: 30 }, center: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 } };

export default function RegisterPage() {
  const theme = useTheme();
  const { palette } = theme;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);
  const displayError = localError || error;
  const canProceed = () => email && password.length >= 8 && password === confirmPassword;
  const progress = 100;

  const handleSubmit = async () => {
    setLocalError('');
    const result = await dispatch(register({ email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/wallet');
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: palette.mode === 'dark' ? 'radial-gradient(ellipse at 30% 20%, rgba(5,150,105,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(217,119,6,0.04) 0%, transparent 50%)' : 'radial-gradient(ellipse at 30% 20%, rgba(5,150,105,0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}>
          <Card sx={{ backdropFilter: 'blur(20px)', bgcolor: palette.mode === 'dark' ? 'rgba(26,29,36,0.8)' : 'rgba(255,255,255,0.9)', border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 1, color: 'primary.main' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                  <CredentixLogo size={32} color="currentColor" />
                  <Typography variant="h4" fontWeight={800}>Credentix</Typography>
                </Box>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Create your account</Typography>
                </Box>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 4, borderRadius: 2, bgcolor: 'divider', '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: 'primary.main' } }} />
              </Box>
              {displayError && <Alert severity="error" onClose={() => { setLocalError(''); dispatch(clearError()); }} sx={{ mb: 2 }}>{displayError}</Alert>}
              <AnimatePresence mode="wait">
                <motion.div key="step-0" variants={stepVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: 'text.primary' }}>Create your account</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Start with your email and a secure password</Typography>
                  <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" autoFocus slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailRounded sx={{ color: 'text.secondary' }} /></InputAdornment> } }} sx={{ mb: 2.5 }} />
                  <TextField label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" helperText="Must be at least 8 characters" slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: 'text.secondary' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}</IconButton></InputAdornment> } }} sx={{ mb: 2.5 }} />
                  <TextField label="Confirm Password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: 'text.secondary' }} /></InputAdornment> } }} />
                </motion.div>
              </AnimatePresence>
              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={loading || !canProceed()} sx={{ flex: 1, py: 1.5 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                </Button>
              </Box>
              <Typography sx={{ mt: 3, textAlign: 'center' }} variant="body2" color="text.secondary">
                Already have an account? <Link component={RouterLink} to="/login" underline="hover" fontWeight={600} sx={{ color: 'primary.main' }}>Sign in</Link>
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </PageTransition>
  );
}
