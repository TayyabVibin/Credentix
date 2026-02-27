import { useEffect, useRef } from 'react';
import { AdyenCheckout, Dropin } from '@adyen/adyen-web/auto';
import '@adyen/adyen-web/styles/adyen.css';
import Box from '@mui/material/Box';

interface Props {
  sessionId: string;
  sessionData: string;
  clientKey: string;
  environment: string;
  countryCode?: string;
  onPaymentCompleted: (resultCode: string) => void;
  onError: (error: unknown) => void;
}

export default function AdyenDropin({
  sessionId,
  sessionData,
  clientKey,
  environment,
  countryCode = 'US',
  onPaymentCompleted,
  onError,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<Awaited<ReturnType<typeof AdyenCheckout>> | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initCheckout() {
      if (!containerRef.current) return;

      try {
        const checkout = await AdyenCheckout({
          environment: environment === 'test' ? 'test' : 'live',
          clientKey,
          countryCode,
          session: { id: sessionId, sessionData },
          onPaymentCompleted: (result: { resultCode: string }) => {
            if (!mounted) return;
            onPaymentCompleted(result.resultCode);
          },
          onPaymentFailed: (data?: { resultCode: string }) => {
            if (!mounted) return;
            if (data?.resultCode) onPaymentCompleted(data.resultCode);
          },
          onError: (error: unknown) => {
            if (!mounted) return;
            onError(error);
          },
          analytics: { enabled: false },
        });

        if (!mounted || !containerRef.current) return;

        checkoutRef.current = checkout;
        new Dropin(checkout).mount(containerRef.current);
      } catch (err) {
        if (mounted) onError(err);
      }
    }

    initCheckout();

    return () => {
      mounted = false;
    };
  }, [sessionId, sessionData, clientKey, environment, countryCode, onPaymentCompleted, onError]);

  return (
    <Box sx={{ minHeight: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box ref={containerRef} sx={{ width: '100%' }} />
    </Box>
  );
}
