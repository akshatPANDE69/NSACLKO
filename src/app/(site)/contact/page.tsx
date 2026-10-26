import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | NASA Space Apps Lucknow 2026",
  description: "Contact the NASA Space Apps Lucknow team about participating, school enquiries, partnerships and the 2026 event at SRGI.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
