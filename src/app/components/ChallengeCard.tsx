'use client';

import { event } from '@/lib/event';
import { motion } from 'framer-motion';

interface ChallengeCardProps {
  title: string;
  description: string;
  category: string;
}

export default function ChallengeCard({
  title,
  description,
  category,
}: ChallengeCardProps) {

  return (
    <motion.div
      className="challenge-card group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="p-6 relative z-10">
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-300 mb-4">{description}</p>

          <span className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300">{category}</span>
          <a href={event.challengesUrl} className="mt-4 w-full py-2 px-4 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors">View 2026 Challenges</a>

        </div>
      </div>
    </motion.div>
  );
}
