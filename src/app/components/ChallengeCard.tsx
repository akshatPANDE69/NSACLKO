import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { event } from "@/lib/event";

interface ChallengeCardProps {
  id: string;
  category: string;
  title: string;
  description: string;
  skills: string;
  approach: string;
  Icon: LucideIcon;
}

export default function ChallengeCard({ id, category, title, description, skills, approach, Icon }: ChallengeCardProps) {
  return (
    <article className="challenge-area-card">
      <div className="challenge-card-top"><Icon size={38} strokeWidth={1} aria-hidden="true" /><span>{id} / {category}</span></div>
      <h3>{title}</h3>
      <p className="challenge-card-description">{description}</p>
      <p className="challenge-card-skills">{skills}</p>
      <div className="challenge-card-approach"><span>What you could create</span><p>{approach}</p></div>
      <a href={event.challengesUrl} className="challenge-card-link">Explore official briefs <ArrowUpRight size={18} aria-hidden="true" /></a>
    </article>
  );
}
