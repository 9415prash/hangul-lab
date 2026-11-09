import assert from "node:assert/strict";
import { compose, decompose, layoutFor } from "./docs/hangul.js";
for (let lead = 0; lead < 19; lead++) {
 for (let vowel = 0; vowel < 21; vowel++) {
  for (let final = 0; final < 28; final++) {
   const parts = [lead, vowel, final];
   const canonical = String.fromCodePoint(0x1100 + lead, 0x1161 + vowel, ...(final ? [0x11a7 + final] : []));
   assert.equal(compose(parts), canonical.normalize("NFC"));
   assert.deepEqual(decompose(compose(parts)), parts);
  }
 }
}
assert.equal(decompose("한글"), null);
assert.equal(decompose("🧪"), null);
assert.equal(layoutFor(0), "side");
assert.equal(layoutFor(13), "stacked");
assert.equal(layoutFor(9), "mixed");
console.log("All 11,172 Hangul syllables round-trip and match Unicode NFC.");
