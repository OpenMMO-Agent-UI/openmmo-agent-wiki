// Which protocol version the live server actually requires, asked rather than
// assumed.
//
//   node scripts/server-protocol.mjs [wss://host/ws]
//
// The changelog's "current version" marker means "what the server runs", and
// that is not the newest protocol in upstream's code — the deployed build has
// been both ahead of and behind master. Assuming they were the same put
// "the live server now requires v44" on the page while the server was still
// on v40, telling everyone their working client was about to be refused.
//
// Prints the number and nothing else, or exits 2 if the server cannot be
// asked. No dependencies on purpose: the handshake is one small MessagePack
// frame and the answer is plain text inside the refusal.

const URL_ = process.argv[2] ?? "wss://openmmo.to.nexus/ws";
const TIMEOUT_MS = 10000;

// Node ships a global WebSocket from 22 on, which is what CI runs. Said out
// loud so an older local Node fails with the reason rather than a bare
// ReferenceError from inside a promise.
if (typeof WebSocket === "undefined") {
  process.stderr.write(
    `no global WebSocket — this needs Node 22 or newer (running ${process.version})\n`,
  );
  process.exit(2);
}

// `{ClientInfo: [1, "cli", "wiki-sync"]}` the way rmp_serde reads it: an enum
// is a one-entry map, a struct is a positional array. Version 1 is deliberate
// — it is refused by every server there has ever been, and the refusal is
// what carries the number we came for.
function clientInfo() {
  const str = (s) => {
    const b = Buffer.from(s, "utf8");
    return Buffer.concat([Buffer.from([0xa0 | b.length]), b]);
  };
  return Buffer.concat([
    Buffer.from([0x81]), // map, 1 entry
    str("ClientInfo"),
    Buffer.from([0x93, 0x01]), // array of 3; protocol version 1
    str("cli"),
    str("wiki-sync"),
  ]);
}

const required = await new Promise((resolve, reject) => {
  const ws = new WebSocket(URL_);
  ws.binaryType = "arraybuffer";
  const timer = setTimeout(() => reject(new Error("no answer")), TIMEOUT_MS);
  const done = (fn, v) => {
    clearTimeout(timer);
    try {
      ws.close();
    } catch {
      // already closing
    }
    fn(v);
  };
  ws.onopen = () => ws.send(clientInfo());
  ws.onmessage = (event) => {
    // The refusal's text rides in the frame as UTF-8; no need to decode the
    // envelope to read a number out of it.
    const text = Buffer.from(event.data).toString("utf8");
    const m = text.match(/Protocol v(\d+) required/);
    if (m) done(resolve, Number(m[1]));
  };
  ws.onclose = () =>
    done(reject, new Error("closed without saying which protocol"));
  ws.onerror = () => done(reject, new Error("could not reach the server"));
});

process.stdout.write(`${required}\n`);
