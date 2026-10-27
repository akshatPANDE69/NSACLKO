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
  regGame: "fifa", regTeam: "", regRoster: "",
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
let responseGate = null;
const requests = [];
const requestWaiters = [];
function waitForRequests(count) {
  if (requests.length >= count) return Promise.resolve();
  return new Promise(resolve => requestWaiters.push({ count, resolve }));
}

function makeForm(game = "fifa") {
  const values = { ...entered, regGame: game };
  if (["bgmi", "cod", "freefire"].includes(game)) {
    values.regTeam = "VM Test Team";
    values.regRoster = "VM Test One: UID-123; VM Test Two: UID-456";
  }
  const elements = Object.fromEntries(Object.entries(values).map(([id, value]) => [id, { value }]));
  const names = { name: "regName", alias: "regTag", email: "regEmail", phone: "regPhone", game: "regGame", team: "regTeam", roster: "regRoster" };
  elements.submitBtn = { innerHTML: "SUBMIT REGISTRATION", disabled: false };
  elements.formFeedback = { className: "form-feedback", textContent: "", setAttribute() {} };
  elements.regForm = {
    elements: { namedItem: name => elements[names[name]] },
    querySelector: selector => selector === '[type="submit"]' ? elements.submitBtn : elements.formFeedback,
    reportValidity: () => true,
    reset: () => Object.keys(values).forEach(id => { elements[id].value = id === "regGame" ? game : ""; }),
  };
  return { elements, values, form: elements.regForm };
}

function loadPage() {
  const { elements } = makeForm();
  const page = vm.createContext({
    document: { addEventListener() {}, getElementById: id => elements[id] },
    window: { addEventListener() {} },
    crypto: webcrypto, TextEncoder, AbortSignal, TypeError, sessionStorage,
    fetch: async (url, options) => {
      assert.equal(url, "/api/tournaments/registrations");
      assert.equal(options.method, "POST");
      const payload = JSON.parse(options.body);
      assert.match(payload.key, /^[0-9a-f-]{36}$/i);
      requests.push(payload);
      for (const waiter of requestWaiters) if (requests.length >= waiter.count) waiter.resolve();
      if (responseGate) await responseGate;
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
  return {
    elements,
    markup: game => page.gameRegistrationMarkup(game),
    submit: (form = elements.regForm) => page.handleFormSubmit({ preventDefault() {}, currentTarget: form }),
  };
}

function assertEnteredValuesRemain(page) {
  for (const [id, value] of Object.entries(entered)) assert.equal(page.elements[id].value, value, `${id} must survive a failed submission`);
  assert.equal(page.elements.submitBtn.disabled, false, "A failed submission must allow a retry");
  assert.match(page.elements.formFeedback.className, /error/);
}

function assertNoStoredPersonalDetails() {
  const persisted = JSON.stringify(storageWrites).toLowerCase();
  for (const [id, value] of Object.entries(entered)) {
    if (id !== "regGame" && value) assert.equal(persisted.includes(value.toLowerCase()), false, `${id} must not be persisted in raw form`);
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

unavailable = false;
page = loadPage();
const cod = makeForm("cod");
await page.submit(cod.form);
assert.equal(requests.at(-1).game, "cod", "The clicked game's form must submit its own fixed title, not a different form's values");
assert.match(cod.elements.formFeedback.className, /success/);
assert.equal(cod.elements.regGame.value, "cod", "Resetting a successful form must retain its game");
assert.equal(page.elements.regName.value, entered.regName, "Submitting one game must not reset another game's draft");

// Switching games while a response is pending must not block the second form
// or put the first form's receipt in the second game's terminal.
page = loadPage();
let release;
responseGate = new Promise(resolve => { release = resolve; });
const beforePending = requests.length;
const first = page.submit();
await waitForRequests(beforePending + 1);
assert.equal(page.elements.submitBtn.disabled, true);
await page.submit();
assert.equal(requests.length, beforePending + 1, "Repeated submits on the same pending form must not create another request");
const squad = makeForm("bgmi");
const second = page.submit(squad.form);
await waitForRequests(beforePending + 2);
assert.equal(squad.elements.submitBtn.disabled, true);
assert.doesNotMatch(page.elements.formFeedback.className, /success/);
assert.doesNotMatch(squad.elements.formFeedback.className, /success/);
release();
await Promise.all([first, second]);
responseGate = null;
assert.equal(requests.at(-2).game, "fifa");
assert.equal(requests.at(-1).game, "bgmi");
assert.match(page.elements.formFeedback.className, /success/);
assert.match(squad.elements.formFeedback.className, /success/);
assert.notEqual(page.elements.formFeedback.textContent, squad.elements.formFeedback.textContent, "Each form receives its own reference");

for (const game of ["fifa", "tekken", "mk", "bgmi", "cod", "freefire"]) {
  const markup = page.markup(game);
  assert.match(markup, new RegExp(`name="game" value="${game}"`));
  assert.doesNotMatch(markup, /<select/);
  assert.match(markup, /Your details are stored privately/);
  assert.match(markup, /mailto:nasaspaceappschallenge\.lucknow@gmail\.com/);
  assert.equal(markup.includes('name="roster"'), ["bgmi", "cod", "freefire"].includes(game), "Only squad titles need a roster field");
}
const html = await readFile(new URL("../public/gaming/index.html", import.meta.url), "utf8");
assert.doesNotMatch(html, /id="registration"|href="#registration"/, "The general terminal and its dead links must be removed");

console.log("PASS browser registration: per-game forms, independent pending requests, lost-response reload retries, private storage and retained error inputs");
