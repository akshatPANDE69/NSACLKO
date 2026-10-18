import "server-only";
import { randomInt } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { GamePlayer } from "./google";
import { GameError } from "./http";
import { validateReplay, type Replay } from "./engine";

export type Board = { entries: { rank: number; name: string; score: number; isYou: boolean }[]; personal: { rank: number; score: number } | null };

export class GameStore {
  constructor(private database: SupabaseClient) {}

  async rememberPlayer(player: GamePlayer) {
    const { error } = await this.database.from("game_players").upsert({
      player_id: player.id, display_name: player.name, email: player.email,
    });
    if (error) throw error;
  }

  async start(player: GamePlayer) {
    const { data, error } = await this.database.rpc("start_game_run", {
      p_user: player.id, p_seed: randomInt(1, 2_147_483_647), p_name: player.name, p_email: player.email,
    });
    if (error?.message.includes("Too many flights")) throw new GameError("Too many flights. Take a short break and try again.", 429);
    if (error) throw error;
    return { id: data.id as string, seed: data.seed as number, playerId: player.id };
  }

  async submit(player: GamePlayer, runId: string, replay: unknown) {
    const { data: run, error } = await this.database.from("game_runs")
      .select("id, seed, created_at, status, score").eq("id", runId).eq("player_id", player.id).maybeSingle();
    if (error) throw error;
    if (!run) throw new GameError("This flight could not be found.", 404);
    if (run.status === "submitted") return run.score as number;
    if (run.status !== "open") throw new GameError("A newer flight replaced this one. Start a new game.", 409);
    let score: number;
    try { score = validateReplay(run.seed, replay, Date.now() - Date.parse(run.created_at)); }
    catch (error) { throw new GameError(error instanceof Error ? error.message : "Flight could not be verified.", 422); }
    const { ticks, flaps } = replay as Replay;
    const { data, error: saveError } = await this.database.rpc("finish_game_run", {
      p_user: player.id, p_run: run.id, p_score: score, p_ticks: ticks, p_flaps: flaps,
    });
    if (saveError?.message.includes("Flight is no longer open")) throw new GameError("A newer flight replaced this one. Start a new game.", 409);
    if (saveError?.message.includes("Flight has expired")) throw new GameError("This flight has expired. Start a new ranked game.", 422);
    if (saveError) throw saveError;
    return data.score as number;
  }

  async leaderboard(playerId = "") {
    const { data, error } = await this.database.rpc("get_game_leaderboard", { p_user: playerId || null });
    if (error) throw error;
    return data as Board;
  }
}

export function getGameStore() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return null;
  return new GameStore(createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } }));
}
