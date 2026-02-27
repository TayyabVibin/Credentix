import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { motion, useInView, animate } from 'framer-motion';
import Lottie from 'lottie-react';
import { useAppSelector } from '../../store/hooks';
import { gradients } from '../../design-system/tokens';
import heroAnim from '../../assets/animations/online payment.json';
import cardPaymentAnim from '../../assets/animations/Cards payment.json';
import processingAnim from '../../assets/animations/Card payment in Process.json';
import analyticsAnim from '../../assets/animations/Data Analytics.json';
import coinAnim from '../../assets/animations/Turning Coin.json';
import walletAnim from '../../assets/animations/coin circling wallet.json';
import gatewayAnim from '../../assets/animations/Mobile App Payment Gateway.json';

const GLASS = {
  backdropFilter: 'blur(16px)',
  bgcolor: 'rgba(30,41,59,0.55)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 4,
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' as const },
  }),
};

const features = [
  {
    title: 'Card Payment Integration',
    description: 'Enterprise-grade Adyen payment processing with PCI-compliant Drop-in UI for secure card transactions.',
    animation: cardPaymentAnim,
  },
  {
    title: 'Real-Time Processing',
    description: 'Payments are authorized, captured, and allocated in real-time through an event-driven state machine.',
    animation: processingAnim,
  },
  {
    title: 'Webhook Architecture',
    description: 'Idempotent webhook processing with HMAC verification, retry handling, and full audit trail.',
    animation: analyticsAnim,
  },
  {
    title: 'Secure Infrastructure',
    description: 'JWT authentication, role-based access control, encrypted storage, and enterprise observability.',
    animation: gatewayAnim,
  },
];

const creditBenefits = [
  'Access premium API endpoints and higher rate limits',
  'Unlock advanced analytics and reporting dashboards',
  'Priority webhook delivery with guaranteed ordering',
  'Dedicated support channel with faster SLA',
  'Flexible consumption — use credits when you need them',
  'Volume discounts on larger bundles',
];

const metrics = [
  { label: 'Uptime', value: 99.9, suffix: '%' },
  { label: 'Transactions Processed', value: 150000, suffix: '+' },
  { label: 'Average Latency', value: 120, suffix: 'ms' },
  { label: 'Webhook Delivery', value: 99.7, suffix: '%' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const creditsRef = useRef(null);
  const metricsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' });
  const creditsInView = useInView(creditsRef, { once: true, margin: '-80px' });
  const metricsInView = useInView(metricsRef, { once: true, margin: '-80px' });

  return (
    <Box sx={{ bgcolor: '#0A0C10', color: '#F1F5F9', minHeight: '100vh', overflow: 'hidden' }}>
      <Box
        component="nav"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(10,12,16,0.85)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Typography variant="h5" fontWeight={800} sx={{ background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Credentix
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              {isAuthenticated ? (
                <Button variant="contained" onClick={() => navigate('/wallet')} sx={{ px: 3 }}>
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="text" sx={{ color: '#94A3B8' }} onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button variant="contained" onClick={() => navigate('/register')} sx={{ px: 3 }}>
                    Get Started
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Box ref={heroRef} sx={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', pt: 10, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(139,92,246,0.06) 0%, transparent 50%)' }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, x: -40 }} animate={heroInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
                <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, fontWeight: 900, lineHeight: 1.1, mb: 3, background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Next-Generation Credit Payment Infrastructure
                </Typography>
                <Typography variant="h6" sx={{ color: '#94A3B8', fontWeight: 400, lineHeight: 1.7, mb: 4, maxWidth: 520 }}>
                  Enterprise-grade payment processing powered by Adyen. Purchase credits, manage wallets, and process transactions with real-time webhook handling.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button variant="contained" size="large" onClick={() => navigate(isAuthenticated ? '/wallet' : '/register')} sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>
                    Get Started
                  </Button>
                  <Button variant="outlined" size="large" onClick={() => navigate(isAuthenticated ? '/wallet' : '/login')} sx={{ px: 4, py: 1.5, fontSize: '1rem', borderColor: 'rgba(255,255,255,0.15)', color: '#F1F5F9', '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.04)' } }}>
                    Explore Dashboard
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={heroInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8, delay: 0.2 }}>
                <Box sx={{ maxWidth: 500, mx: 'auto' }}>
                  <Lottie animationData={heroAnim} loop />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box ref={featuresRef} sx={{ py: { xs: 10, md: 16 }, position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0}>
            <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 2 }}>Built for Modern Fintech</Typography>
            <Typography variant="h6" textAlign="center" sx={{ mb: 8, maxWidth: 600, mx: 'auto', color: '#94A3B8' }}>
              A complete payment infrastructure with enterprise-grade reliability, security, and developer experience.
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {features.map((f, i) => (
              <Grid size={{ xs: 12, sm: 6 }} key={f.title}>
                <motion.div initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} variants={fadeUp} custom={i + 1} style={{ height: '100%' }}>
                  <Box sx={{ ...GLASS, p: 4, height: '100%', transition: 'all 0.3s ease', '&:hover': { border: '1px solid rgba(0,229,255,0.2)', boxShadow: '0 8px 40px rgba(0,229,255,0.08)', transform: 'translateY(-4px)' } }}>
                    <Box sx={{ maxWidth: 120, mb: 3 }}><Lottie animationData={f.animation} loop /></Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{f.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7 }}>{f.description}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box ref={creditsRef} sx={{ py: { xs: 10, md: 16 }, position: 'relative' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={creditsInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}>
                <Box sx={{ maxWidth: 350, mx: { xs: 'auto', md: 0 } }}><Lottie animationData={coinAnim} loop /></Box>
              </motion.div>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div initial="hidden" animate={creditsInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0}>
                <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>Why Credits?</Typography>
                <Typography variant="body1" sx={{ color: '#94A3B8', mb: 4, lineHeight: 1.8, maxWidth: 540 }}>
                  Credits provide a flexible, prepaid consumption model that gives you full control over your spending.
                </Typography>
              </motion.div>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {creditBenefits.map((b, i) => (
                  <motion.div key={b} initial="hidden" animate={creditsInView ? 'visible' : 'hidden'} variants={fadeUp} custom={i + 1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 2.5, ...GLASS, borderRadius: 2 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00E5FF', flexShrink: 0 }} />
                      <Typography variant="body2" sx={{ color: '#CBD5E1' }}>{b}</Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 10, textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={creditsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.6, duration: 0.6 }}>
              <Box sx={{ maxWidth: 300, mx: 'auto', mb: 3 }}><Lottie animationData={walletAnim} loop /></Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Your Wallet, Your Control</Typography>
              <Typography variant="body1" sx={{ color: '#94A3B8', maxWidth: 500, mx: 'auto' }}>
                Track every credit in real-time with a full transaction ledger, instant balance updates, and complete spending visibility.
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      <Box ref={metricsRef} sx={{ py: { xs: 10, md: 14 } }}>
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate={metricsInView ? 'visible' : 'hidden'} variants={fadeUp} custom={0}>
            <Typography variant="h3" fontWeight={800} textAlign="center" sx={{ mb: 2 }}>Trusted Infrastructure</Typography>
            <Typography variant="h6" textAlign="center" sx={{ color: '#94A3B8', mb: 8, maxWidth: 500, mx: 'auto' }}>Built for reliability at scale with enterprise-grade monitoring.</Typography>
          </motion.div>
          <Grid container spacing={3}>
            {metrics.map((m, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={m.label}>
                <motion.div initial="hidden" animate={metricsInView ? 'visible' : 'hidden'} variants={fadeUp} custom={i + 1}>
                  <Box sx={{ ...GLASS, p: 4, textAlign: 'center', transition: 'all 0.3s ease', '&:hover': { border: '1px solid rgba(0,229,255,0.2)', boxShadow: '0 8px 40px rgba(0,229,255,0.06)' } }}>
                    <Typography variant="h3" fontWeight={900} sx={{ background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', mb: 1 }}>
                      <AnimatedCounter target={m.value} suffix={m.suffix} />
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>{m.label}</Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 10, md: 16 }, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(0,229,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>Ready to Get Started?</Typography>
            <Typography variant="h6" sx={{ color: '#94A3B8', mb: 5 }}>Join Credentix and experience premium payment infrastructure.</Typography>
            <Button variant="contained" size="large" onClick={() => navigate(isAuthenticated ? '/wallet' : '/register')} sx={{ px: 6, py: 2, fontSize: '1.1rem' }}>
              Create Free Account
            </Button>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748B' }}>{new Date().getFullYear()} Credentix. All rights reserved.</Typography>
            <Typography variant="body2" sx={{ background: gradients.hero, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 600 }}>Credentix</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
