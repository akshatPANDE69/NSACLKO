"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Linkedin,
  Github,
  Twitter,
  Mail,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
} from "lucide-react"

export interface TeamMember {
  id: number
  name: string
  role: string
  department: string
  badge: string
  bio: string
  specialties: string[]
  quote?: string
  socials: {
    linkedin?: string
    github?: string
    twitter?: string
    email?: string
  }
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Akshat Pande",
    role: "Local Lead & Event Director",
    department: "Executive Committee",
    badge: "Local Lead",
    bio: "Pioneering the NASA Space Apps Challenge Lucknow chapter to create high-impact opportunities for students, developers, and space enthusiasts across Uttar Pradesh. Dedicated to connecting grassroots talent with NASA's open-source science and missions.",
    specialties: ["Mission Strategy", "Aerospace Advocacy", "Global Coordination"],
    quote: "The next frontier of space exploration begins with a curious mind willing to build.",
    socials: {
      linkedin: "https://www.linkedin.com/company/nasa-space-apps-challenge-lucknow",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 2,
    name: "Ananya Sharma",
    role: "Technical & Systems Lead",
    department: "Engineering & Dev",
    badge: "Tech Lead",
    bio: "Systems architect and developer leading platform engineering, data APIs, and hackathon technical workshops. Overseeing participant judging portals and open data integration for real-time telemetry datasets.",
    specialties: ["Cloud Architecture", "Data Engineering", "Distributed Systems"],
    quote: "Transforming vast streams of cosmic telemetry into accessible, actionable software.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 3,
    name: "Dr. Rohan Verma",
    role: "Scientific Mentor & Astrophysics Lead",
    department: "Research & Mentorship",
    badge: "Scientific Advisor",
    bio: "Astrophysicist and academic mentor guiding participant teams through orbital trajectories, Earth observation analysis, and planetary science challenges. Passionate about empowering multidisciplinary teams.",
    specialties: ["Astrophysics", "Earth Observation", "Orbital Mechanics"],
    quote: "Deep space is not just for astronomers—it is an open workshop for all humanity.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 4,
    name: "Ishita Kapoor",
    role: "UI/UX & Creative Director",
    department: "Design & Experience",
    badge: "Design Lead",
    bio: "Crafting the visual identity, interactive web experiences, and aesthetic atmosphere for NASA Space Apps Lucknow. Focuses on intuitive digital tools and immersive cosmic visual design.",
    specialties: ["Design Systems", "Cosmic Aesthetics", "Interface Design"],
    quote: "Great design bridges the gap between complex science and human wonder.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 5,
    name: "Kabir Sengupta",
    role: "Community & Outreach Coordinator",
    department: "Outreach & Relations",
    badge: "Community Lead",
    bio: "Building bridges with universities, school STEM clubs, and student tech communities across Lucknow and northern India. Passionate about welcoming first-time hackathon attendees.",
    specialties: ["Community Engagement", "Campus Ambassadors", "Youth Mentorship"],
    quote: "Innovation flourishes when people from every background solve problems together.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
  {
    id: 6,
    name: "Meera Nair",
    role: "Operations & Logistics Manager",
    department: "Operations & Venue",
    badge: "Operations Lead",
    bio: "Orchestrating 48 hours of seamless hackathon operations at SRGI Lucknow, including participant hospitality, mentor synchronization, judging schedule management, and on-ground logistics.",
    specialties: ["Event Operations", "Logistics Coordination", "Participant Care"],
    quote: "Flawless logistics give hackers the freedom to focus entirely on building the future.",
    socials: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      twitter: "https://twitter.com",
      email: "mailto:spaceappschallenge.lko@gmail.com",
    },
  },
]

export function Pattern() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(TEAM_MEMBERS.length)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", handleSelect)
    api.on("reInit", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  const currentMember = TEAM_MEMBERS[current] || TEAM_MEMBERS[0]

  return (
    <div className="w-full flex flex-col items-center">
      {/* Carousel Container */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto px-4">
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {TEAM_MEMBERS.map((member, index) => {
              const isActive = index === current
              return (
                <CarouselItem key={member.id} className="basis-full">
                  <div className="p-1">
                    <Card
                      className={`relative aspect-square overflow-hidden border p-0 rounded-2xl transition-all duration-500 shadow-2xl ${
                        isActive
                          ? "border-cyan-500/50 shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                          : "border-white/10 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={`https://picsum.photos/800/800?grayscale&random=${member.id}`}
                        alt={member.name}
                        width={800}
                        height={800}
                        className="h-full w-full object-cover select-none pointer-events-none transition-transform duration-700 hover:scale-105"
                      />

                      {/* Vignette & Gradients */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                        <span className="text-[10px] font-mono tracking-widest uppercase bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                          {member.badge}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest text-gray-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                          {String(index + 1).padStart(2, "0")} /{" "}
                          {String(TEAM_MEMBERS.length).padStart(2, "0")}
                        </span>
                      </div>

                      {/* Bottom Info Banner on Image */}
                      <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
                        <p className="text-white text-base font-medium truncate">
                          {member.name}
                        </p>
                        <p className="text-cyan-400 text-xs font-mono truncate">
                          {member.role}
                        </p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>

          {/* Desktop Navigation Arrows */}
          <CarouselPrevious className="hidden sm:inline-flex -left-12 md:-left-16 bg-zinc-900/80 hover:bg-white hover:text-black border-white/20 text-white backdrop-blur-md" />
          <CarouselNext className="hidden sm:inline-flex -right-12 md:-right-16 bg-zinc-900/80 hover:bg-white hover:text-black border-white/20 text-white backdrop-blur-md" />
        </Carousel>

        {/* Mobile Navigation Controls */}
        <div className="flex sm:hidden items-center justify-between mt-3 px-2">
          <button
            type="button"
            onClick={() => api?.scrollPrev()}
            className="p-2 rounded-full bg-zinc-900/80 border border-white/15 text-white active:scale-95"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-gray-400">
            {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => api?.scrollNext()}
            className="p-2 rounded-full bg-zinc-900/80 border border-white/15 text-white active:scale-95"
            aria-label="Next team member"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Dots Bar */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {TEAM_MEMBERS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => api?.scrollTo(idx)}
              aria-label={`Jump to team member ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === current
                  ? "w-8 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400/50"
                  : "w-2 h-2 bg-white/20 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Dynamic Text Section - Updates based on active slide */}
      <div className="w-full max-w-2xl mx-auto mt-8 px-4 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Department tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentMember.department}</span>
            </div>

            {/* Name / Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide text-white">
              {currentMember.name}
            </h2>

            {/* Role */}
            <p className="text-base sm:text-lg font-mono text-cyan-400 tracking-wider">
              {currentMember.role}
            </p>

            {/* Bio */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans max-w-xl mx-auto">
              {currentMember.bio}
            </p>

            {/* Quote if present */}
            {currentMember.quote && (
              <div className="pt-2">
                <blockquote className="inline-flex items-center gap-2 text-xs sm:text-sm italic text-gray-400 font-mono border-l-2 border-cyan-500/50 pl-3 py-1 text-left max-w-lg mx-auto">
                  <Quote className="w-3.5 h-3.5 text-cyan-400 shrink-0 inline" />
                  <span>&ldquo;{currentMember.quote}&rdquo;</span>
                </blockquote>
              </div>
            )}

            {/* Specialties / Skills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              {currentMember.specialties.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full hover:border-white/30 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 pt-4">
              {currentMember.socials.linkedin && (
                <a
                  href={currentMember.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 transition-all"
                  aria-label={`${currentMember.name} LinkedIn`}
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {currentMember.socials.github && (
                <a
                  href={currentMember.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 transition-all"
                  aria-label={`${currentMember.name} GitHub`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {currentMember.socials.twitter && (
                <a
                  href={currentMember.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 transition-all"
                  aria-label={`${currentMember.name} X / Twitter`}
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {currentMember.socials.email && (
                <a
                  href={currentMember.socials.email}
                  className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-cyan-400 hover:bg-cyan-950/40 transition-all"
                  aria-label={`Email ${currentMember.name}`}
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick Team Member Thumbnail Selector */}
      <div className="mt-12 w-full max-w-3xl px-4 border-t border-white/10 pt-8">
        <p className="text-center text-xs font-mono uppercase tracking-widest text-gray-500 mb-5">
          Select Team Member To View
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {TEAM_MEMBERS.map((member, idx) => {
            const isSelected = idx === current
            return (
              <button
                key={member.id}
                type="button"
                onClick={() => api?.scrollTo(idx)}
                className={`group flex flex-col items-center p-2 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? "bg-cyan-950/30 border-cyan-400/60 shadow-lg shadow-cyan-950/50"
                    : "bg-zinc-900/40 border-white/10 hover:border-white/30 hover:bg-zinc-900/80"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 mb-2 transition-transform duration-300 group-hover:scale-105 ${
                    isSelected ? "border-cyan-400" : "border-white/20"
                  }`}
                >
                  <img
                    src={`https://picsum.photos/800/800?grayscale&random=${member.id}`}
                    alt={member.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`text-[11px] font-medium leading-tight truncate w-full text-center ${
                    isSelected ? "text-cyan-300" : "text-gray-400 group-hover:text-white"
                  }`}
                >
                  {member.name.split(" ")[0]}
                </span>
                <span className="text-[9px] font-mono text-gray-500 truncate w-full text-center">
                  {member.badge}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pattern
