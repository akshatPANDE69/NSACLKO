import Head from "next/head";
import Image from "next/image";

import EffectsInitializer from "../components/EffectsInitializer";
import { Button } from "../components/components/ui/button";
import { Input } from "../components/components/ui/input";
import { Label } from "../components/components/ui/label";
import { Textarea } from "../components/components/ui/textarea";

import "../styles/base.css";
import "../styles/register.css";

export default function Registration() {
  return (
    <div>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="Welcome to my Next.js application!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EffectsInitializer />

      <section id="register" className="registration-section">
        <div className="registration-content fade-in">
          <h2 className="main-heading">Join The Mission</h2>
          <p className="typing-content">
            Ready to contribute to space exploration and Earth science? Register
            now for NASA Space Apps Challenge 2025 Lucknow Edition. Limited
            spots available.
          </p>

          <form className="registration-form">
            <div className="form-row">
              <div className="form-group">
                <Input
                  type="text"
                  id="firstName"
                  required
                  className="!bg-transparent !border-0 !border-b !border-[#333] !rounded-none !shadow-none focus:!border-white focus:!shadow-none !outline-none focus:!outline-none"
                />
                <Label htmlFor="firstName">First Name</Label>
              </div>
              <div className="form-group">
                <Input
                  type="text"
                  id="lastName"
                  required
                  className="!bg-transparent !border-0 !border-b !border-[#333] !rounded-none !shadow-none focus:!border-white focus:!shadow-none !outline-none focus:!outline-none"
                />
                <Label htmlFor="lastName">Last Name</Label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <Input
                  type="email"
                  id="email"
                  required
                  className="!bg-transparent !border-0 !border-b !border-[#333] !rounded-none !shadow-none focus:!border-white focus:!shadow-none !outline-none focus:!outline-none"
                />
                <Label htmlFor="email">Email Address</Label>
              </div>
              <div className="form-group">
                <Input
                  type="text"
                  id="institution"
                  required
                  className="!bg-transparent !border-0 !border-b !border-[#333] !rounded-none !shadow-none focus:!border-white focus:!shadow-none !outline-none focus:!outline-none"
                />
                <Label htmlFor="institution">Institution</Label>
              </div>
            </div>
            <div className="form-group">
              <Input
                type="text"
                id="skills"
                required
                className="!bg-transparent !border-0 !border-b !border-[#333] !rounded-none !shadow-none focus:!border-white focus:!shadow-none !outline-none focus:!outline-none"
              />
              <Label htmlFor="skills">Skills & Background</Label>
            </div>
            <div className="form-group">
              <Textarea
                id="motivation"
                required
                rows={2}
                className="!bg-transparent !border-0 !border-b !border-[#333] !rounded-none !shadow-none focus:!border-white focus:!shadow-none resize-none !outline-none focus:!outline-none"
              />
              <Label htmlFor="motivation">
                Why do you want to participate in NASA Space Apps Challenge?
              </Label>
            </div>
            <Button type="submit" variant="ghost" className="submit-btn">
              Register Now
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
