"use client";

import { Button } from "@/app/components/components/ui/button";
import { Card } from "@/app/components/components/ui/card";
import { Input } from "@/app/components/components/ui/input";
import { Label } from "@/app/components/components/ui/label";
import { Textarea } from "@/app/components/components/ui/textarea";
import { useState } from "react";
import { event } from "@/lib/event";

export default function ContactPage() {
  const [draftUrl, setDraftUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    setDraftUrl(`mailto:${event.email}?subject=${encodeURIComponent(String(data.get("subject")))}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="contact-page min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-light text-center mb-6 tracking-wider">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 text-center max-w-3xl mx-auto font-light">
            Get in touch with the NASA Space Apps Challenge Lucknow team
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="p-8 bg-gray-900/50 border-gray-800">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows={5}
                    required
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Prepare Email
                </Button>
                <p className="text-sm text-gray-400">This form prepares an email draft. Send it from your email app.</p>
                {draftUrl && <p role="status" className="text-sm text-gray-300">Your draft is ready. <a className="underline" href={draftUrl}>Open email draft</a> to send your message.</p>}
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-light tracking-wide">Get in Touch</h2>
                <p className="text-gray-400 leading-relaxed">
                  Have questions about NASA Space Apps Challenge Lucknow? We&apos;re here to help!
                  Reach out to us through the form or use the contact information below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-light text-gray-300">Location</h3>
                  <p className="text-gray-400">
                    {event.venue}<br />
                    {event.address}<br />
                    {event.dates}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-light text-gray-300">Email</h3>
                  <a 
                    href="mailto:spaceappschallenge.lko@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    spaceappschallenge.lko@gmail.com
                  </a>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-light text-gray-300">Social Media</h3>
                  <a href={event.whatsappUrl} target="_blank" rel="noopener noreferrer" className="block text-green-300 hover:text-green-200">Join our WhatsApp community</a>
                  <div className="flex space-x-4">
                    <a
                      aria-label="Instagram"
                      href={event.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg
                        className="size-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
