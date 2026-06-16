'use client';

import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface SchemeCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  benefits: string[];
  eligibility: string;
  applyLink: string;
  applyLabel?: string;
  index?: number;
}

export function SchemeCard({
  icon,
  name,
  description,
  benefits,
  eligibility,
  applyLink,
  applyLabel = 'Apply Now',
  index = 0,
}: SchemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-brand-gray hover:from-white hover:to-brand-cream group">
        {/* Icon Header */}
        <div className="h-20 bg-gradient-to-r from-brand-blue via-brand-blue-light to-brand-green flex items-center justify-center text-white group-hover:shadow-md transition-shadow">
          <div className="text-4xl">{icon}</div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-xl text-brand-blue">{name}</CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-2">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Benefits */}
          <div>
            <h4 className="font-semibold text-brand-blue text-sm mb-2">Key Benefits:</h4>
            <ul className="space-y-1">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-brand-green font-bold mt-0.5">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Eligibility */}
          <div className="pt-3 border-t border-brand-gray">
            <h4 className="font-semibold text-brand-blue text-sm mb-2">Eligibility:</h4>
            <p className="text-sm text-gray-700">{eligibility}</p>
          </div>

          {/* Apply Button */}
          <div className="pt-3">
            <a href={applyLink} target="_blank" rel="noopener noreferrer" className="w-full block">
              <Button
                variant="secondary"
                className="w-full group/btn"
              >
                {applyLabel}
                <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-0.5" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
