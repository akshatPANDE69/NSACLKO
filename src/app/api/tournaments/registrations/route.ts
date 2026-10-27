import { createHash, createHmac } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { GameError, gameResponse, readGameBody } from "@/lib/game/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const registration = z.object({
  key: z.string().uuid(),
  name: z.string().trim().min(1).max(100),
  alias: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  phone: z.string().trim().min(8).max(32).refine(value => /^[+\d ()-]+$/.test(value) && value.replace(/\D/g, "").length >= 8 && value.replace(/\D/g, "").length <= 15),
  game: z.enum(["fifa", "tekken", "mk", "bgmi", "cod", "freefire"]),
  team: z.string().trim().max(100).default(""),
  roster: z.string().trim().max(2000).default(""),
}).strict();

export async function POST(request: Request) {
  try {
    const target = new URL(request.url);
    const destination = `${target.protocol}//${request.headers.get("host") || target.host}`;
    if (request.headers.get("origin") !== destination ||
      (request.headers.has("sec-fetch-site") && request.headers.get("sec-fetch-site") !== "same-origin")) {
      throw new GameError("Please register from this website.", 403);
    }
    const result = registration.safeParse(await readGameBody(request, 12_000));
    if (!result.success) throw new GameError("Please check your name, gamer tag, email, phone and selected game.", 400);
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !secret) throw new GameError("Registration is temporarily unavailable. Please try again.", 503);
    const { key, ...payload } = result.data;
    const database = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
    const address = (request.headers.get("x-forwarded-for") || "unknown").split(",")[0].trim();
    const { data, error } = await database.rpc("register_esports", {
      p_key: key,
      p_payload: payload,
      p_digest: createHash("sha256").update(JSON.stringify(payload)).digest("hex"),
      p_ip_hash: createHmac("sha256", secret).update(address).digest("hex"),
    });
    if (error?.message.includes("registration_rate_limit")) throw new GameError("Too many registrations from this connection. Please try again later.", 429);
    if (error?.message.includes("registration_key_conflict")) throw new GameError("Your details changed during submission. Refresh the page before trying again.", 409);
    if (error || !/^LKO-[A-F0-9]{16}$/.test(data?.reference) || typeof data?.created !== "boolean") {
      throw new GameError("Your registration could not be saved. Please keep your details and try again.", 503);
    }
    return gameResponse({ reference: data.reference }, data.created ? 201 : 200);
  } catch (error) {
    if (error instanceof GameError) return gameResponse({ error: error.message }, error.status);
    return gameResponse({ error: "Your registration could not be saved. Please try again." }, 503);
  }
}
