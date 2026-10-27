import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { once } from "node:events";
import { PGlite } from "@electric-sql/pglite";
import { POST } from "../src/app/api/tournaments/registrations/route.ts";

const db = new PGlite();
await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
await db.exec(await readFile(new URL("../supabase/migrations/202610270001_tournament_registrations.sql", import.meta.url), "utf8"));
let unavailable = false;
const server = createServer(async (request, response) => {
  assert.equal(request.url, "/rest/v1/rpc/register_esports");
  assert.equal(request.headers.apikey, "test-server-secret");
  let raw = "";
  for await (const part of request) raw += part;
  if (unavailable) { response.writeHead(503); response.end(JSON.stringify({message:"private service detail"})); return; }
  const p = JSON.parse(raw);
  try {
    const result = await db.query("select public.register_esports($1::uuid,$2::jsonb,$3,$4) as result", [p.p_key, JSON.stringify(p.p_payload), p.p_digest, p.p_ip_hash]);
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(result.rows[0].result));
  } catch(error) {
    response.writeHead(400, {"Content-Type":"application/json"});
    response.end(JSON.stringify({message:error.message,code:error.code}));
  }
});
server.listen(0,"127.0.0.1");
await once(server,"listening");
process.env.SUPABASE_URL = `http://127.0.0.1:${server.address().port}`;
process.env.SUPABASE_SECRET_KEY = "test-server-secret";
const valid = {key:randomUUID(),name:"Test Entrant",alias:"Tester",email:"entrant@example.com",phone:"+91 90000 00000",game:"fifa",team:"Solo",roster:""};
const origin = "https://nsaclko.vercel.app";
const submit = (data=valid, ip="198.51.100.10", headers={}) => POST(new Request(origin+"/api/tournaments/registrations", {method:"POST",headers:{Origin:origin,Host:"nsaclko.vercel.app","Content-Type":"application/json","x-forwarded-for":ip,...headers},body:JSON.stringify(data)}));
try {
  assert.equal((await submit(valid,undefined,{Origin:"https://other.example"})).status,403);
  assert.equal((await submit({...valid,name:"x".repeat(14000)})).status,413);
  for (const field of [{email:"invalid"},{game:"unknown"},{phone:"x"},{name:" "},{alias:" "},{roster:"x".repeat(2001)}]) assert.equal((await submit({...valid,...field})).status,400);
  const first = await submit();
  assert.equal(first.status,201);
  const receipt = await first.json();
  assert.match(receipt.reference,/^LKO-[A-F0-9]{16}$/);
  assert.deepEqual(Object.keys(receipt),["reference"]);
  assert.equal((await db.query("select email from public.tournament_registrations")).rows[0].email,valid.email);
  const retry = await submit();
  assert.equal(retry.status,200);
  assert.deepEqual(await retry.json(),receipt);
  assert.equal((await db.query("select count(*)::int as total from public.tournament_registrations")).rows[0].total,1);
  assert.equal((await submit({...valid,name:"Different Entrant"})).status,409);
  for(let i=0;i<20;i++) assert.equal((await submit({...valid,key:randomUUID()},"203.0.113.20")).status,201);
  assert.equal((await submit({...valid,key:randomUUID()},"203.0.113.20")).status,429);
  unavailable = true;
  const failed = await submit({...valid,key:randomUUID()});
  assert.equal(failed.status,503);
  assert.doesNotMatch(JSON.stringify(await failed.json()),/private service detail|entrant@example/);
  for(const role of ["anon","authenticated"]) {
    await db.exec(`set role ${role}`);
    await assert.rejects(db.exec("select * from public.tournament_registrations"),/permission denied/);
    await assert.rejects(db.query("select public.register_esports($1::uuid,'{}'::jsonb,'digest','ip')",[randomUUID()]),/permission denied/);
    await db.exec("reset role");
  }
  console.log("PASS tournament registration: real PostgreSQL saves, private records, validation, same-origin, body bounds, idempotent retries, conflict, rate limits and safe outages");
} finally {
  server.closeAllConnections();
  server.close();
  await db.close();
}
