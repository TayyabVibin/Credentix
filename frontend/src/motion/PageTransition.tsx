import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { transitions } from './transitions';

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={transitions.page}
    >
      {children}
    </motion.div>
  );
}
