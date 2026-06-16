'use client';

import { useState } from 'react';
import { ExternalLink, CheckCircle2, Users, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface SchemeCardProps {
  icon: string;
  name: string;
  description: string;
  benefits: string[];
  eligibility: string;
  applyLink: string;
  applyLabel?: string;
  index?: number;
  accentColor?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.92, rotateX: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.12,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const benefitVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.1 + i * 0.07, ease: 'easeOut' },
  }),
};

export function SchemeCard({
  icon,
  name,
  description,
  benefits,
  eligibility,
  applyLink,
  applyLabel = 'Apply Now',
  index = 0,
  accentColor = 'from-brand-blue to-brand-green',
}: SchemeCardProps) {
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-80, 80], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-80, 80], [-8, 8]), { stiffness: 200, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="group h-full"
    >
      <div
        className="relative h-full flex flex-col rounded-2xl overflow-hidden border border-white/60 shadow-[0_4px_24px_-6px_rgba(0,51,102,0.13)] hover:shadow-[0_16px_48px_-8px_rgba(0,51,102,0.28)] transition-shadow duration-500 bg-white"
      >
        {/* Animated glow border on hover */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
        />

        {/* Top accent bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${accentColor}`} />

        {/* Icon section */}
        <div className="relative px-6 pt-6 pb-0">
          <div className="flex items-start justify-between">
            <motion.div
              animate={hovered ? { scale: 1.15, rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${accentColor} flex items-center justify-center text-3xl shadow-lg`}
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
            >
              {icon}
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 + 0.4, duration: 0.4, type: 'spring' }}
              className="text-xs font-bold uppercase tracking-widest text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-full px-3 py-1"
            >
              Govt. Scheme
            </motion.span>
          </div>

          <div className="mt-4" style={{ transform: 'translateZ(12px)' }}>
            <h3 className="text-xl font-extrabold text-brand-blue leading-tight">{name}</h3>
            <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.12 + 0.3, duration: 0.6, ease: 'easeOut' }}
          className={`mx-6 mt-5 h-px bg-gradient-to-r ${accentColor} origin-left`}
        />

        {/* Benefits */}
        <div className="px-6 pt-4 flex-1">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-blue/50 mb-3">Key Benefits</p>
          <ul className="space-y-2">
            {benefits.map((benefit, idx) => (
              <motion.li
                key={idx}
                custom={idx}
                variants={benefitVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-2.5 text-sm text-gray-700"
              >
                <CheckCircle2 className="h-4 w-4 text-brand-green mt-0.5 flex-shrink-0" />
                <span>{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Eligibility */}
        <div className="mx-6 mt-4 p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="h-3.5 w-3.5 text-brand-blue/60" />
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue/50">Eligibility</p>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{eligibility}</p>
        </div>

        {/* Apply Button */}
        <div className="p-6 pt-4">
          <a href={applyLink} target="_blank" rel="noopener noreferrer" className="block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r ${accentColor} shadow-md hover:shadow-xl transition-shadow duration-300 group/btn`}
            >
              {applyLabel}
              <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
