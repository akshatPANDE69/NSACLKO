import { event } from "./event";

export const contactTopics = ["Participating", "Schools & colleges", "Partnerships", "Something else"] as const;
export type ContactTopic = typeof contactTopics[number];
export type ContactFields = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  if (!fields.name.trim()) errors.name = "Please enter your name.";
  else if (fields.name.trim().length > 100) errors.name = "Please keep your name within 100 characters.";
  if (!fields.email.trim()) errors.email = "Please enter your email address.";
  else if (fields.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Please enter a valid email address.";
  if (!fields.message.trim()) errors.message = "Tell us a little about your enquiry.";
  else if (fields.message.trim().length > 3000) errors.message = "Please keep your message within 3,000 characters.";
  return errors;
}

export function createContactDraft(fields: ContactFields, topic: ContactTopic): string | null {
  if (Object.keys(validateContact(fields)).length || !contactTopics.includes(topic)) return null;
  const subject = `${topic} | NASA Space Apps Lucknow ${event.year}`;
  const body = `Hello Space Apps Lucknow team,\n\n${fields.message.trim()}\n\nName: ${fields.name.trim()}\nEmail: ${fields.email.trim()}\nEnquiry: ${topic}`;
  return `mailto:${event.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
