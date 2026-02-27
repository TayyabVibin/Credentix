import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface Props {
  value: number;
  format?: (n: number) => string;
}

export default function AnimatedCounter({
  value,
  format = (n) => n.toLocaleString(),
}: Props) {
  const [displayValue, setDisplayValue] = useState(value);
  const spring = useSpring(value, { stiffness: 100, damping: 30 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.8, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {format(displayValue)}
    </motion.span>
  );
}
