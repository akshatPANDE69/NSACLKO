'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import ChallengeCard from "../components/ChallengeCard";
import "../styles/challenges.css";
import "../styles/base.css";

const categories = ["All", "Space Innovation", "Data Science", "AI/ML", "Games"];


const challenges = [
  {
    id: 1,
    title: "Space Innovation Lab",
    description: "Design and prototype innovative solutions for space exploration using NASA's open-source data and APIs.",
    category: "Space Innovation",
  },
  {
    id: 2,
    title: "Cosmic Data Visualization",
    description: "Create compelling visualizations of space data to help communicate complex astronomical concepts.",
    category: "Data Science",
  },
  {
    id: 3,
    title: "AI Space Applications",
    description: "Develop AI-powered solutions for space exploration, satellite imaging, or astronomical data analysis.",
    category: "AI/ML",
  },
  {
    id: 4,
    title: "Space Survival Simulator",
    description: "Create an engaging game that simulates survival challenges in space environments.",
    category: "Games",
  },
  {
    id: 5,
    title: "Mars Mission Control",
    description: "Design a strategic game for managing resources and operations on a Mars colony.",
    category: "Games",
  },
];

export default function ChallengePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredChallenges = challenges.filter((challenge) => selectedCategory === "All" || challenge.category === selectedCategory);

  return (
    <div className="challenges-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="challenges-content"
      >
        {/* Hero Section */}
        <section className="hero-section">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hero-title text-5xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            2026 CHALLENGE AREAS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hero-subtitle text-center text-xl text-gray-300 mb-12"
          >
            Explore these project areas, then choose a challenge from the official 2026 catalogue.
            These cards illustrate possible approaches, not separate competitions.
            <br /><a href="https://www.spaceappschallenge.org/2026/challenges/" className="underline">Browse official NASA challenges</a>
          </motion.p>
        </section>

        {/* Filters */}
        <div className="filters mb-8 flex flex-wrap gap-4 justify-center">
          <div className="filter-group">
            <label htmlFor="challenge-category" className="text-gray-400 mr-2">Category:</label>
            <select
              id="challenge-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>


        </div>

        {/* Challenge Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              category={challenge.category}
            />
          ))}
        </motion.div>

        {filteredChallenges.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 mt-8"
          >
            No challenges found with the selected filters.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
