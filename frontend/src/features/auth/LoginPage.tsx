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
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/authSlice';
import { PageTransition } from '../../motion';
import { gradients } from '../../design-system/tokens';
import gatewayAnim from '../../assets/animations/Mobile App Payment Gateway.json';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate('/wallet');
    }
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0A0C10', p: 2, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(0,229,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.04) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1, maxWidth: 900, width: '100%' }}>
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Box sx={{ maxWidth: 360 }}><Lottie animationData={gatewayAnim} loop /></Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#F1F5F9', mt: 3, mb: 1 }}>Welcome back to Credentix</Typography>
              <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>Manage your credits, process payments, and monitor transactions — all from one dashboard.</Typography>
            </motion.div>
          </Box>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} style={{ flex: 1, maxWidth: 440 }}>
            <Card sx={{ width: '100%', backdropFilter: 'blur(20px)', bgcolor: 'rgba(20,23,31,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" fontWeight={800} sx={{ background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>Credentix</Typography>
                  <Typography sx={{ color: '#94A3B8' }}>Sign in to your account</Typography>
                </Box>
                {error && <Alert severity="error" onClose={() => dispatch(clearError())} sx={{ mb: 3 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                  <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" autoFocus slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailRounded sx={{ color: '#64748B' }} /></InputAdornment> } }} sx={{ mb: 2.5 }} />
                  <TextField label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: '#64748B' }} /></InputAdornment>, endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}</IconButton></InputAdornment> } }} sx={{ mb: 3 }} />
                  <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ py: 1.5 }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                  </Button>
                </form>
                <Typography sx={{ mt: 3, textAlign: 'center' }} variant="body2">
                  <Typography component="span" sx={{ color: '#94A3B8' }}>Don't have an account? </Typography>
                  <Link component={RouterLink} to="/register" underline="hover" fontWeight={600} sx={{ color: 'primary.main' }}>Sign up</Link>
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Box>
    </PageTransition>
  );
}
