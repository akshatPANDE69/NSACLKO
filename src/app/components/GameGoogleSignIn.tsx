"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: { accounts: { id: {
      initialize(options: { client_id: string; nonce: string; callback(response: { credential: string }): void; auto_select: boolean; use_fedcm_for_button: boolean; ux_mode: "popup" }): void;
      renderButton(element: HTMLElement, options: { type: string; theme: string; size: string; text: string; shape: string; width: number }): void;
      disableAutoSelect(): void;
    } } };
  }
}

type Props = { clientId: string; nonce: string; busy: boolean; onCredential(credential: string): void };

export default function GameGoogleSignIn({ clientId, nonce, busy, onCredential }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  callback.current = onCredential;
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const id = window.google?.accounts.id;
    const element = host.current;
    if (!ready || !id || !element) return;
    id.initialize({ client_id: clientId, nonce, auto_select: false, use_fedcm_for_button: false, ux_mode: "popup",
      callback: (response) => callback.current(response.credential) });
    id.renderButton(element, { type: "standard", theme: "outline", size: "large", text: "signin_with", shape: "rectangular", width: Math.min(320, Math.max(200, element.clientWidth)) });
    return () => element.replaceChildren();
  }, [ready, clientId, nonce]);

  return <>
    <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setFailed(true)} />
    <div ref={host} className={`flappy-google-native${busy ? " flappy-google-busy" : ""}`} aria-busy={busy} />
    {(!ready || busy) && <p className="flappy-google-status" role="status">{busy ? "Signing in…" : "Loading Google sign in…"}</p>}
    {failed && <p className="flappy-google-status" role="alert">Google could not load. Check your connection and refresh the page.</p>}
  </>;
}
