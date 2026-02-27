import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface Props {
  value: number;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({
  value,
  format = (n) => n.toLocaleString(),
  prefix = '',
  suffix = '',
}: Props) {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(value, { stiffness: 120, damping: 28 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [spring]);

  const formatted = format(displayValue);

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.8, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
}
