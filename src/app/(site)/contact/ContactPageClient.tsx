"use client";

import { useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { event } from "@/lib/event";
import { contactTopics, createContactDraft, validateContact, type ContactErrors, type ContactFields, type ContactTopic } from "@/lib/contact";

const initialFields: ContactFields = { name: "", email: "", message: "" };
const mapUrl = "https://www.google.com/maps/search/?api=1&query=SR+Group+of+Institutions+Bakshi+Ka+Talab+Lucknow";

export default function ContactPageClient() {
  const [fields, setFields] = useState(initialFields);
  const [topic, setTopic] = useState<ContactTopic>(contactTopics[0]);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [draftUrl, setDraftUrl] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const draftLink = useRef<HTMLAnchorElement>(null);

  const update = (field: keyof ContactFields, value: string) => {
    setFields(current => ({ ...current, [field]: value }));
    setDraftUrl(null);
    setErrors(current => ({ ...current, [field]: undefined }));
  };
  const blur = (field: keyof ContactFields) => setErrors(current => ({ ...current, [field]: validateContact(fields)[field] }));
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validateContact(fields);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      const field = e.currentTarget.elements.namedItem(firstError);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    setDraftUrl(createContactDraft(fields, topic));
    requestAnimationFrame(() => draftLink.current?.focus());
  };
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(event.email); setCopyStatus("Email address copied."); }
    catch { setCopyStatus("Select the email address to copy it, or open the email link."); }
  };

  return <article className="contact-page contact-editorial">
    <section className="contact-layout" aria-labelledby="contact-title">
      <header className="contact-intro">
        <p className="contact-kicker">NASA SPACE APPS / LUCKNOW {event.year}</p>
        <h1 id="contact-title">Contact us</h1>
        <p>Questions about participating, bringing your school, or working with us? Get in touch with the Lucknow team.</p>
      </header>

      <aside className="contact-details" aria-label="Contact details">
        <div className="contact-email">
          <p className="contact-label">Email</p>
          <div className="contact-email-row"><a href={`mailto:${event.email}`}>{event.email}</a><button type="button" className="contact-copy" aria-label="Copy the team email address" onClick={copyEmail}>{copyStatus === "Email address copied." ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}</button></div>
          <p className="contact-copy-status" role="status">{copyStatus}</p>
        </div>
        <a className="contact-social" href={event.whatsappUrl} target="_blank" rel="noopener noreferrer"><FaWhatsapp size={20} aria-hidden="true" /><span>WhatsApp community</span><ArrowUpRight size={17} aria-hidden="true" /></a>
        <a className="contact-social" href={event.instagramUrl} target="_blank" rel="noopener noreferrer"><FaInstagram size={19} aria-hidden="true" /><span>Instagram <small>@nsac_lko</small></span><ArrowUpRight size={17} aria-hidden="true" /></a>
      </aside>

      <form id="contact-enquiry" className="contact-form" onSubmit={submit} noValidate aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">Send an enquiry</h2>
        <p className="contact-form-intro">Leave your details and a little context.</p>
        <div className="contact-fields-row">
          <div className="contact-field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" value={fields.name} onChange={e => update("name", e.target.value)} onBlur={() => blur("name")} placeholder="Your name" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} />{errors.name && <span id="contact-name-error" className="contact-error">{errors.name}</span>}</div>
          <div className="contact-field"><label htmlFor="contact-email">Email address</label><input id="contact-email" name="email" type="email" autoComplete="email" inputMode="email" value={fields.email} onChange={e => update("email", e.target.value)} onBlur={() => blur("email")} placeholder="you@example.com" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />{errors.email && <span id="contact-email-error" className="contact-error">{errors.email}</span>}</div>
        </div>
        <div className="contact-field"><label htmlFor="contact-topic">About</label><select id="contact-topic" name="topic" value={topic} onChange={e => { setTopic(e.target.value as ContactTopic); setDraftUrl(null); }}>{contactTopics.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
        <div className="contact-field contact-message-field"><label htmlFor="contact-message-text">Message</label><textarea id="contact-message-text" name="message" rows={4} value={fields.message} onChange={e => update("message", e.target.value)} onBlur={() => blur("message")} placeholder="How can we help?" maxLength={3000} required aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : "contact-message-limit"} /><div className="contact-message-footer">{errors.message && <span id="contact-message-error" className="contact-error">{errors.message}</span>}<span id="contact-message-limit">{fields.message.length.toLocaleString()} / 3,000</span></div></div>
        <div className="contact-submit"><button type="submit">Prepare Email <ArrowUpRight size={18} aria-hidden="true" /></button><p>Prepare a draft, then open it<br />in your email app to send.</p></div>
        {draftUrl && <div className="contact-draft" role="status"><Check size={18} aria-hidden="true" /><div><p>Your email draft is ready. Nothing has been sent yet.</p><a ref={draftLink} href={draftUrl}>Open email draft <ArrowUpRight size={15} aria-hidden="true" /></a></div></div>}
      </form>

      <aside className="contact-venue" aria-labelledby="contact-venue-title">
        <p className="contact-label">Event venue</p>
        <h2 id="contact-venue-title">SRGI, Lucknow</h2>
        <p>{event.venue}<br />{event.address}</p>
        <div><a href={mapUrl} target="_blank" rel="noopener noreferrer">Directions <ArrowUpRight size={15} aria-hidden="true" /></a><span>{event.dates}</span></div>
      </aside>
    </section>
  </article>;
}
