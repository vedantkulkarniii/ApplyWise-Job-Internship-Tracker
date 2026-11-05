/**
 * Animation utilities and variants for ApplyWise
 */

/**
 * Framer Motion variants for common animations
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const slideLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    }
  },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/**
 * CSS Animation classes for Tailwind
 */
export const animationClasses = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Slide animations
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Bounce
  bounce: 'animate-bounce',
  
  // Spin
  spin: 'animate-spin',
  spinSlow: 'animate-spin-slow',
  
  // Pulse
  pulse: 'animate-pulse',
  
  // Wiggle
  wiggle: 'animate-wiggle',
  
  // Shake
  shake: 'animate-shake',
};

/**
 * Tailwind animation configuration
 * Add to tailwind.config.ts
 */
export const tailwindAnimations = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-fade-out {
  animation: fade-out 0.3s ease-out;
}

.animate-slide-in-up {
  animation: slide-in-up 0.4s ease-out;
}

.animate-slide-in-down {
  animation: slide-in-down 0.4s ease-out;
}

.animate-slide-in-left {
  animation: slide-in-left 0.4s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.4s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-spin-slow {
  animation: spin 3s linear infinite;
}
`;

/**
 * Transition utilities
 */
export const transitions = {
  default: 'transition-all duration-200 ease-in-out',
  fast: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
  colors: 'transition-colors duration-200 ease-in-out',
  transform: 'transition-transform duration-200 ease-in-out',
  opacity: 'transition-opacity duration-200 ease-in-out',
};

/**
 * Hover effects
 */
export const hoverEffects = {
  lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
  scale: 'hover:scale-105 transition-transform duration-200',
  glow: 'hover:shadow-xl hover:shadow-blue-500/50 transition-shadow duration-200',
  brighten: 'hover:brightness-110 transition-all duration-200',
  slideRight: 'hover:translate-x-1 transition-transform duration-200',
};

/**
 * Loading animations
 */
export const loadingAnimations = {
  spinner: (
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  ),
  dots: (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  ),
  pulse: (
    <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse" />
  ),
};

/**
 * Apply animation with delay
 */
export function withDelay(className: string, delay: number): string {
  return `${className} [animation-delay:${delay}ms]`;
}

/**
 * Generate staggered animation delays
 */
export function generateStaggerDelays(count: number, baseDelay: number = 50): string[] {
  return Array.from({ length: count }, (_, i) => `${i * baseDelay}ms`);
}

/**
 * Intersection Observer for scroll animations
 */
export function useScrollAnimation() {
  if (typeof window === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.scroll-animate').forEach((el) => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}

/**
 * Page transition wrapper
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.3 },
};

/**
 * Modal/Dialog animations
 */
export const modalAnimations = {
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  content: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },
};

/**
 * Success/Error feedback animations
 */
export const feedbackAnimations = {
  success: 'animate-scale-in text-green-600',
  error: 'animate-shake text-red-600',
  warning: 'animate-wiggle text-yellow-600',
  info: 'animate-fade-in text-blue-600',
};
