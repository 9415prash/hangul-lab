# Hangul Lab

[Live demo](https://9415prash.github.io/hangul-lab/)

Hangul Lab is a bilingual visual playground for building Korean syllable blocks. Pick an initial consonant, vowel, and optional final consonant to see the block change shape and get the composed Unicode character.

## Run locally

Install Node.js, then run:

```sh
node dev.mjs
```

Open http://127.0.0.1:3200. The site is static and has no package dependencies. The files in `docs/` can be served by any static host.

## Demo in one minute

1. Choose **한**, **물**, and **과** in the opening to compare side-by-side, stacked, and combined vowel layouts. Move your pointer over the illustration to see the letterforms shift.
2. Choose **Open in the builder** to take the selected example into the playground and experiment with its letters.
3. Use the Parts and Syllable toggle, or copy the result. Tab between letter groups, use arrow keys to move within a group, and press Space or Enter to choose.
4. Switch to Korean. The URL stores the current language and syllable, so a reload or shared link restores the same selection.

## How it works

- `docs/hangul.js` converts between indices and precomposed Hangul syllables using the arithmetic in [Unicode §3.12](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/). It covers 19 initials, 21 vowels and 28 final states, for 11,172 modern syllables.
- `docs/app.js` uses one selection to update the letter controls, Unicode output, and placement diagram. A compound vowel uses two diagram cells. The component diagram shows spatial structure and the final view shows the composed font glyph.
- `docs/style.css` animates position changes and includes a reduced-motion mode. The opening artwork is original SVG with layered shapes and pointer-driven offsets.

The design takes inspiration from [Lusion](https://lusion.co/)'s interactive typography and motion. The artwork, interface, and interaction code are specific to this project.

Run `node check.mjs` to verify all 11,172 syllables against Unicode normalization.
