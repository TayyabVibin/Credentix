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
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import LinearProgress from '@mui/material/LinearProgress';
import EmailRounded from '@mui/icons-material/EmailRounded';
import LockRounded from '@mui/icons-material/LockRounded';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRounded from '@mui/icons-material/VisibilityOffRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import BusinessRounded from '@mui/icons-material/BusinessRounded';
import WorkRounded from '@mui/icons-material/WorkRounded';
import PublicRounded from '@mui/icons-material/PublicRounded';
import PhotoCameraRounded from '@mui/icons-material/PhotoCameraRounded';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { register, updateProfile, clearError } from '../store/authSlice.ts';
import PageTransition from '../components/PageTransition.tsx';

const TOTAL_STEPS = 4;

const ROLES = ['Developer', 'Designer', 'Product Manager', 'Engineering Manager', 'CTO / VP Engineering', 'Founder / CEO', 'Student', 'Other'];
const USE_CASES = ['Personal project', 'Startup MVP', 'Enterprise integration', 'Testing & evaluation', 'Academic research', 'Freelance / Agency', 'Other'];
const BUSINESS_TYPES = ['SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'Education', 'Media', 'Consulting', 'Other'];
const COUNTRIES = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'India', 'Japan', 'Brazil', 'Netherlands', 'United Arab Emirates', 'Other'];

const stepVariant = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [userTitle, setUserTitle] = useState('');
  const [useCase, setUseCase] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [country, setCountry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [localError, setLocalError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  const displayError = localError || error;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setLocalError('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return email && password.length >= 8 && password === confirmPassword;
      case 1:
        return fullName.trim().length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    setLocalError('');
    if (step === 0) {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (password.length < 8) {
        setLocalError('Password must be at least 8 characters');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    setLocalError('');
    dispatch(clearError());
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setLocalError('');
    const result = await dispatch(register({ email, password }));
    if (register.fulfilled.match(result)) {
      const profileData: Record<string, string> = {};
      if (fullName) profileData.fullName = fullName;
      if (company) profileData.company = company;
      if (userTitle) profileData.userTitle = userTitle;
      if (useCase) profileData.useCase = useCase;
      if (avatarPreview) profileData.avatarUrl = avatarPreview;
      if (country) profileData.country = country;
      if (businessType) profileData.businessType = businessType;

      if (Object.keys(profileData).length > 0) {
        await dispatch(updateProfile(profileData));
      }
      navigate('/wallet');
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <PageTransition>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#0B0F1A',
          p: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(56,189,248,0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 1 }}
        >
          <Card
            sx={{
              backdropFilter: 'blur(20px)',
              bgcolor: 'rgba(30,41,59,0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Credentix
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    Step {step + 1} of {TOTAL_STEPS}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    {['Account', 'Personal', 'Professional', 'Preferences'][step]}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #6366F1, #38BDF8)',
                    },
                  }}
                />
              </Box>

              {displayError && (
                <Alert
                  severity="error"
                  onClose={() => { setLocalError(''); dispatch(clearError()); }}
                  sx={{ mb: 2 }}
                >
                  {displayError}
                </Alert>
              )}

              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="step-0" variants={stepVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: '#F1F5F9' }}>
                      Create your account
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                      Start with your email and a secure password
                    </Typography>
                    <TextField
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
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
                          startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: '#64748B' }} /></InputAdornment>,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                    />
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="step-1" variants={stepVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: '#F1F5F9' }}>
                      Personal details
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                      Tell us a bit about yourself
                    </Typography>
                    <TextField
                      label="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      autoFocus
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      sx={{ mb: 2.5 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3, borderRadius: 3, border: '1px dashed rgba(255,255,255,0.15)', bgcolor: 'rgba(255,255,255,0.02)' }}>
                      <Avatar
                        src={avatarPreview ?? undefined}
                        sx={{ width: 80, height: 80, bgcolor: 'primary.dark', fontSize: 32 }}
                      >
                        {avatarPreview ? null : <PhotoCameraRounded sx={{ fontSize: 32 }} />}
                      </Avatar>
                      <Button variant="outlined" component="label" size="small" sx={{ borderColor: 'rgba(255,255,255,0.15)', color: '#94A3B8' }}>
                        Upload Photo
                        <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                      </Button>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Optional — max 2MB
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step-2" variants={stepVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: '#F1F5F9' }}>
                      Professional info
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                      Help us personalize your experience
                    </Typography>
                    <TextField
                      label="Company Name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><BusinessRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      sx={{ mb: 2.5 }}
                    />
                    <TextField
                      select
                      label="Your Role"
                      value={userTitle}
                      onChange={(e) => setUserTitle(e.target.value)}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><WorkRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      sx={{ mb: 2.5 }}
                    >
                      {ROLES.map((r) => (
                        <MenuItem key={r} value={r}>{r}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Primary Use Case"
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                    >
                      {USE_CASES.map((u) => (
                        <MenuItem key={u} value={u}>{u}</MenuItem>
                      ))}
                    </TextField>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step-3" variants={stepVariant} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5, color: '#F1F5F9' }}>
                      Almost there!
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3 }}>
                      Optional details to complete your profile
                    </Typography>
                    <TextField
                      select
                      label="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><PublicRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                      sx={{ mb: 2.5 }}
                    >
                      {COUNTRIES.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      select
                      label="Business Type"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      slotProps={{ input: { startAdornment: <InputAdornment position="start"><BusinessRounded sx={{ color: '#64748B' }} /></InputAdornment> } }}
                    >
                      {BUSINESS_TYPES.map((b) => (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                      ))}
                    </TextField>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                {step > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    startIcon={<ArrowBackRounded />}
                    sx={{ flex: 1, borderColor: 'rgba(255,255,255,0.15)', color: '#94A3B8' }}
                  >
                    Back
                  </Button>
                )}
                {step < TOTAL_STEPS - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={!canProceed()}
                    endIcon={<ArrowForwardRounded />}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                      '&:hover': { background: 'linear-gradient(135deg, #4F46E5, #6366F1)' },
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                      '&:hover': { background: 'linear-gradient(135deg, #4F46E5, #6366F1)' },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                  </Button>
                )}
              </Box>

              <Typography sx={{ mt: 3, textAlign: 'center' }} variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover" fontWeight={600} sx={{ color: '#818CF8' }}>
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
