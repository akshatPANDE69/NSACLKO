"use client";

import { event } from "@/lib/event";
import React from "react";

function getTimeRemaining(targetTime: number) {
  const totalSeconds = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));

  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export default function CountdownWidget() {
  const targetTime = Date.parse(event.countdownEndsAt);
  const [remaining, setRemaining] = React.useState<ReturnType<typeof getTimeRemaining> | null>(null);

  React.useEffect(() => {
    const updateCountdown = () => setRemaining(getTimeRemaining(targetTime));

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [targetTime]);

  const formattedTime = remaining
    ? `${String(remaining.hours).padStart(2, "0")}:${String(remaining.minutes).padStart(2, "0")}:${String(remaining.seconds).padStart(2, "0")}`
    : "--:--:--";

  return (
    <aside className="countdown-widget" aria-label="Event countdown">
      <span className="countdown-live"><span className="countdown-live-dot" aria-hidden="true" />Live</span>
      <span className="countdown-time" aria-label={remaining ? `${remaining.hours} hours, ${remaining.minutes} minutes, ${remaining.seconds} seconds remaining until 2:00 PM IST` : "Countdown loading"}>
        {formattedTime}
      </span>
    </aside>
  );
}
