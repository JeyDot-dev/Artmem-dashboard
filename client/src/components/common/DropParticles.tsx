import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_COLORS = ['#facc15', '#22d3ee', '#f472b6'];

interface DropParticlesProps {
  originRef: React.RefObject<HTMLElement | HTMLDivElement | null>;
  count?: number;
  colors?: string[];
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  duration: number;
}

function generateParticles(count: number, colors: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.random() * 360 * Math.PI) / 180;
    const distance = 25 + Math.random() * 30;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 2,
      duration: 280 + Math.random() * 240,
    };
  });
}

export function DropParticles({
  originRef,
  count = 8,
  colors = DEFAULT_COLORS,
  onComplete,
}: DropParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const completedRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete?.();
      return;
    }

    if (originRef.current) {
      const rect = originRef.current.getBoundingClientRect();
      setOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }

    setParticles(generateParticles(count, colors));
    setVisible(true);
    completedRef.current = 0;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleParticleComplete = () => {
    completedRef.current++;
    if (completedRef.current >= count) {
      setVisible(false);
      onComplete?.();
    }
  };

  if (!visible || particles.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: origin.x,
              top: origin.y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: p.duration / 1000,
              ease: 'easeOut',
            }}
            onAnimationComplete={handleParticleComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
