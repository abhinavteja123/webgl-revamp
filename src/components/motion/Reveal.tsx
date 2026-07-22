import { motion, type HTMLMotionProps } from 'motion/react';

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number;
}

export function Reveal({ children, delay = 0, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
