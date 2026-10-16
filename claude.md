# CLAUDE.md

This site consumes the `@pikonen/second-design-system` design system as an npm
dependency — it doesn't define components, only uses them. If a component
doesn't exist yet in the design system, that's a design-system change (starts in
Figma), not something to build ad hoc here.

## Using design-system components
Never write a raw HTML element (`<button>`, etc.) where a design-system
component already exists for it — use the real component (`Button`,
`Navigation`, `Input`, `Textarea`, etc.), even if hand-writing one would look
identical. This has gone wrong before.

The package ships no contracts and no TypeScript types. Its props are typed by
hand in `src/second-design-system.d.ts`, read from the published
`node_modules/@pikonen/second-design-system/dist/index.js`. Check that file —
and, if in doubt, the component source in `dist/index.js` — before using a
component, not guesswork. When the package is upgraded, re-read the source and
update the declarations; delete the file once the package ships its own types.

- Only use props/variants the component actually implements.
- Don't hardcode a value the component's own stylesheet already sets — let it
  resolve. The package's CSS is unlayered, so it outranks Tailwind utilities on
  any property it sets: a utility that fights it silently loses. Utilities for
  properties it leaves alone (width, margin, flex-wrap …) do apply.
- If you need something the components don't cover, stop and say so rather
  than improvising — that's a change to raise with the design system.

Components accept `className` (Input and Textarea put it on their wrapper, not
the field). A button that shouldn't fill a flex column takes `className="w-fit"`.

Known gaps, worked around until the design system covers them — each is
commented where it is used:
- No Figma text styles in the package: they live in `src/styles.css` as
  `text-h1`, `text-lead`, `text-p`, `text-body` … named exactly as in Figma.
- No error state on Input/Textarea: message in `helperText`, `aria-invalid` on
  the field, and the `field-error` class (styles.css) to colour it.
- No Label component, no icons, no link-styled Button.

## Layout & responsive widths
- One breakpoint seam: `md:`. The Figma designs provide a mobile frame (~390px)
  and a desktop frame (~1280px) — build to those two states, not additional
  breakpoints, unless a real design exists for a size in between.
- Page content column: `max-w-[960px]`, `mx-auto` — the frames' own column.
  Navigation is full-bleed and has no max width of its own.
- Tokens as Tailwind utilities come from `src/ds-theme.css`, generated from
  the package's `tokens.json` by `npm run build:ds-theme` — rerun it after
  upgrading the package. Spacing classes are named by pixel value (`gap-48` is
  48px, the `--space-48` token); Tailwind's default spacing, colour and radius
  scales are switched off, so an off-scale class such as `gap-5` produces
  nothing at all. Check `tokens/spacing.css` in the package for the scale.

## Composition rules
When multiple buttons (or other interactive components) appear together as a
group — a form's actions, a CTA row, a toolbar — they must:
- Share the same size. Button has no size prop, so this holds by default;
  Input's `size` (default / small) must not be mixed within one group unless
  the design explicitly shows a size hierarchy.
- Sit inside a single flex/grid wrapper with one consistent gap token
  (`gap-8`, `gap-16`, etc.) — not individually-margined elements.
- Have one clear alignment (start / end / centered / space-between) rather
  than each element positioned independently.

Example pattern for a button group:
    <div className="flex items-center gap-16">
      <Button variant="outline" onClick={...}>Cancel</Button>
      <Button type="submit">Save</Button>
    </div>

Before finishing any page with more than one button (or similar repeated
component) visually near each other, check: same size, one shared gap, one
alignment. If they're not grouped this way, fix it before considering the
page done.

## Tone of Voice
Write in a professional, clear, and structured manner. Use precise language, concise explanations, and neutral wording. Prioritize clarity, credibility, and consistency over personality.

## Before pushing
- Confirm the `@pikonen/second-design-system` version in package.json and
  package-lock actually matches what you intended to build against.
- If you upgraded it, rerun `npm run build:ds-theme` and re-check
  `src/second-design-system.d.ts` against the new `dist/index.js`.
- If you touched any spacing/colour/text classes, confirm each one still
  generates CSS — Tailwind emits nothing for a class whose token is missing.
