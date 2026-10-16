import { redirect } from "next/navigation";
import { event } from "@/lib/event";

// Preserve registration links already shared with participants.
export default function Register() {
  redirect(event.registrationUrl);
}
