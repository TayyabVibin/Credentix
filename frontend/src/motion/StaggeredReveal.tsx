import { motion } from 'framer-motion';
import { Children, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  staggerDelay?: number;
  trigger?: boolean;
  initial?: { opacity?: number; y?: number };
  animate?: { opacity?: number; y?: number };
}

export default function StaggeredReveal({
  children,
  staggerDelay = 0.05,
  trigger = true,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
}: Props) {
  const items = Children.toArray(children);
  return (
    <>
      {items.map((child, i) => (
        <motion.div
          key={i}
          initial={initial}
          animate={trigger ? animate : initial}
          transition={{ delay: trigger ? i * staggerDelay : 0, duration: 0.4, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
