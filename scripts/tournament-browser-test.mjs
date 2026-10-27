import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

// Regression: discarding a pending key on reload duplicates an entry when the
// database saved it but the browser never received its successful response.
const script = await readFile(new URL("../public/gaming/app.js", import.meta.url), "utf8");
const entered = {
  regName: "VM Test Entrant", regTag: "VM_PLAYER_73",
  regEmail: "vm-player@example.com", regPhone: "+91 98765 43210",
  regGame: "fifa", regTeam: "VM Test Team",
  regRoster: "VM Test One: UID-123; VM Test Two: UID-456",
};
const storageValues = new Map();
const storageWrites = [];
const sessionStorage = {
  getItem: key => storageValues.get(String(key)) ?? null,
  setItem(key, value) {
    storageValues.set(String(key), String(value));
    storageWrites.push([String(key), String(value)]);
  },
  removeItem: key => storageValues.delete(String(key)),
};
const saved = new Map();
let loseNextResponse = true;
let unavailable = false;

function loadPage() {
  const elements = Object.fromEntries(Object.entries(entered).map(([id, value]) => [id, { value }]));
  elements.regForm = {
    reportValidity: () => true,
    reset: () => Object.keys(entered).forEach(id => { elements[id].value = ""; }),
  };
  elements.submitBtn = { innerHTML: "SUBMIT REGISTRATION", disabled: false };
  elements.formFeedback = { className: "form-feedback", textContent: "", setAttribute() {} };
  const page = vm.createContext({
    document: { addEventListener() {}, getElementById: id => elements[id] },
    window: { addEventListener() {} },
    crypto: webcrypto, TextEncoder, AbortSignal, TypeError, sessionStorage,
    fetch: async (url, options) => {
      assert.equal(url, "/api/tournaments/registrations");
      assert.equal(options.method, "POST");
      const payload = JSON.parse(options.body);
      assert.match(payload.key, /^[0-9a-f-]{36}$/i);
      if (unavailable) return new Response(JSON.stringify({ error: "Please try again." }), { status: 503 });
      if (!saved.has(payload.key)) {
        saved.set(payload.key, { reference: `LKO-${String(saved.size + 1).padStart(16, "0")}` });
      }
      if (loseNextResponse) {
        loseNextResponse = false;
        throw new TypeError("Connection interrupted after database commit");
      }
      return new Response(JSON.stringify(saved.get(payload.key)), { status: 200 });
    },
  });
  vm.runInContext(script, page, { filename: "public/gaming/app.js" });
  return { elements, submit: () => page.handleFormSubmit({ preventDefault() {} }) };
}

function assertEnteredValuesRemain(page) {
  for (const [id, value] of Object.entries(entered)) assert.equal(page.elements[id].value, value, `${id} must survive a failed submission`);
  assert.equal(page.elements.submitBtn.disabled, false, "A failed submission must allow a retry");
  assert.match(page.elements.formFeedback.className, /error/);
}

function assertNoStoredPersonalDetails() {
  const persisted = JSON.stringify(storageWrites).toLowerCase();
  for (const [id, value] of Object.entries(entered)) {
    if (id !== "regGame") assert.equal(persisted.includes(value.toLowerCase()), false, `${id} must not be persisted in raw form`);
  }
}

let page = loadPage();
await page.submit();
assertEnteredValuesRemain(page);
assertNoStoredPersonalDetails();
assert.equal(saved.size, 1, "The first request saved even though its response was lost");
const firstReference = [...saved.values()][0].reference;

// A reload gets fresh script state and retains only this tab's sessionStorage.
// The participant restores the same form values before retrying.
page = loadPage();
await page.submit();
assert.equal(saved.size, 1, "Reloading and retrying a saved-but-unconfirmed registration must not create a duplicate");
assert.match(page.elements.formFeedback.className, /success/);
assert.ok(page.elements.formFeedback.textContent.includes(firstReference), "A retry must confirm the original registration reference");
assertNoStoredPersonalDetails();

unavailable = true;
page = loadPage();
await page.submit();
assertEnteredValuesRemain(page);
assertNoStoredPersonalDetails();
assert.equal(saved.size, 1, "An unavailable service must not be presented as a saved registration");

console.log("PASS browser registration: lost-response reload retries preserve one entry and its reference, failures retain inputs, and session storage contains no raw personal details");
