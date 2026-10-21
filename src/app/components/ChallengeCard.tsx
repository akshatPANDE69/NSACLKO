import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { event } from '@/lib/event';

interface ChallengeCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  skills: string;
  approach: string;
  image: string;
}

export default function ChallengeCard({
  id,
  category,
  title,
  description,
  skills,
  approach,
  image,
}: ChallengeCardProps) {
  return (
    <article className="challenge-area-card">
      <div className="challenge-card-media">
        <Image
          src={image}
          alt={title}
          width={600}
          height={340}
          className="challenge-card-img"
        />
      </div>

      <div className="challenge-card-top">
        <span>{id} / {category}</span>
      </div>

      <h3>{title}</h3>

      <p className="challenge-card-description">{description}</p>

      <p className="challenge-card-skills">{skills}</p>

      <div className="challenge-card-approach">
        <span>What you could create</span>
        <p>{approach}</p>
      </div>

      <a
        href={event.challengesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="challenge-card-link"
      >
        Explore official NASA brief{' '}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </article>
  );
}
