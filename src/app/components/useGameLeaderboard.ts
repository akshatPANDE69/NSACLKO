"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Replay } from "@/lib/game/engine";

export type LeaderboardEntry = { rank: number; name: string; score: number; isYou: boolean };
type Board = { available: boolean; entries: LeaderboardEntry[]; personal: { rank: number; score: number } | null };
type Player = { id: string; name: string };
export type RankedRun = { id: string; seed: number; playerId: string };
class RequestError extends Error { constructor(message: string, public status: number) { super(message); } }

async function gameRequest(path: string, body?: unknown) {
  const response = await fetch(`/api/game/${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "same-origin",
    ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
    signal: AbortSignal.timeout(15_000), cache: "no-store",
  });
  const result = await response.json();
  if (!response.ok) throw new RequestError(result.error || "Please try again in a moment.", response.status);
  return result;
}

export function useGameLeaderboard() {
  const [user, setUser] = useState<Player | null>(null);
  const [googleConfig, setGoogleConfig] = useState<{ clientId: string; nonce: string } | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const requestNumber = useRef(0);

  const reloadAuth = useCallback(async () => {
    try {
      const result = await gameRequest("session");
      setUser(result.user);
      setGoogleConfig(result.clientId && result.nonce ? { clientId: result.clientId, nonce: result.nonce } : null);
    } catch { setAuthError("Google sign in could not load. Please refresh the page to try again."); }
    finally { setAuthReady(true); }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("signin") === "failed") {
      setAuthError("Google sign in could not finish. Please try again.");
      url.searchParams.delete("signin");
      window.history.replaceState(null, "", url);
    }
    void reloadAuth();
  }, [reloadAuth]);

  const refresh = useCallback(async () => {
    const request = ++requestNumber.current;
    setRefreshing(true);
    try {
      const result: Board = await gameRequest("leaderboard");
      if (request === requestNumber.current) { setBoard(result); setError(""); }
    } catch (error) {
      if (request === requestNumber.current) setError(error instanceof Error ? error.message : "The leaderboard could not load.");
    } finally {
      if (request === requestNumber.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => { requestNumber.current += 1; window.removeEventListener("focus", onFocus); };
  }, [authReady, user?.id, refresh]);

  const signIn = async (credential: string) => {
    if (!googleConfig) return;
    setAuthBusy(true);
    setAuthError("");
    try {
      const result = await gameRequest("sign-in", { credential, nonce: googleConfig.nonce });
      setUser(result.user);
      setGoogleConfig(null);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Google sign in could not finish. Please try again.");
      await reloadAuth();
    } finally { setAuthBusy(false); }
  };

  const signOut = async () => {
    setAuthBusy(true);
    try {
      await gameRequest("sign-out", {});
      setUser(null);
      setAuthError("");
      window.google?.accounts.id.disableAutoSelect();
      await reloadAuth();
    } catch { setAuthError("Could not sign out. Please try again."); }
    finally { setAuthBusy(false); }
  };

  const startRanked = async (): Promise<RankedRun> => {
    try { return await gameRequest("runs", {}); }
    catch (error) {
      if (error instanceof RequestError && error.status === 401) await reloadAuth();
      throw error;
    }
  };

  const submit = async (run: RankedRun, replay: Replay) => {
    if (user?.id !== run.playerId) throw new Error("Sign in with the account that started this flight to save it.");
    try {
      const result = await gameRequest("scores", { runId: run.id, replay });
      await refresh();
      return result.score as number;
    } catch (error) {
      if (error instanceof RequestError && error.status === 401) await reloadAuth();
      throw error;
    }
  };

  return { user, googleConfig, authReady, authBusy, board, refreshing, error: authError || error,
    signIn, signOut, refresh, startRanked, submit };
}
