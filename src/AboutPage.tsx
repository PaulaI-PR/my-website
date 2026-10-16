import { Button, Footer, Nav } from "pinx-ui";
import { MENU, useContent } from "./content";

// Figma: my-website › About — Desktop (node 114:1118) and About — Mobile
// (114:1180). Same page at two widths, so one component with md: as the seam:
// below md the portrait stacks above the text, at md and up they sit side by
// side in two equal columns.
//
// The frames are drawn in Inter on a slate palette with an Instrument Serif
// quote — none of which is in pinx-ui. Every type style and colour here is the
// nearest design system token instead, so the page matches the rest of the
// site rather than the frame pixel for pixel:
//
//   design                         token
//   h1 Inter SemiBold 48           display-l (Roboto Serif Bold 60)
//   quote Instrument Serif 26/32   display-s / md:display-md, italic
//   lead Inter 20 slate/500        body-lg, text-body (body-disabled would
//                                  fail 4.5:1 at this size)
//   p Inter 16/28 slate/800        body-md (16/1.25)
//   placeholder slate/200          bg-surface
//
// Spacing snaps to the scale, ties rounding up, as on LandingPage:
//
//   design    token   px    used for
//   16        s       16    gutters, mobile top padding, paragraph gap
//   24        m       24    desktop top padding
//   32        l       32    text column gap (exact)
//   40        xl      48    mobile section gaps
//   48        xl      48    desktop gap above the footer (exact)
//   64        2xl     64    desktop column gap (exact)
//
// The portrait is 358 × 448 on mobile and 432 × 540 on desktop — both 4:5 —
// so it is a ratio rather than two fixed heights.
//
// The Download CV button is pinx-ui's primary Button. The frame draws it dark
// slate with a 6px radius, which no Button variant has; the contract allows
// only primary/secondary, so the frame's styling is left to the design system.

export function AboutPage() {
  const content = useContent();

  if (!content) return null;

  return (
    <div className="min-h-screen bg-white font-body text-body">
      <Nav
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === "#/about",
        }))}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-xl px-s pt-s md:pt-m">
        <main className="flex flex-col gap-xl md:flex-row md:items-start md:gap-2xl">
          {/* Stands in for the portrait until there is a photo; swap for an
              <img> at the same 4:5 ratio. */}
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-md bg-surface md:flex-1">
            <p className="text-body-s text-body-disabled">
              {content["label.About_PortraitPlaceholder"]}
            </p>
          </div>

          <div className="flex flex-col gap-l md:flex-1">
            <h1 className="font-display text-display-l text-body">{content["label.About_Title"]}</h1>
            <blockquote className="font-display text-display-s italic text-body md:text-display-md">
              {content["label.About_Quote"]}
            </blockquote>
            <p className="text-body-lg text-body">{content["label.About_Lead"]}</p>
            <div className="flex flex-col gap-s text-body-md text-body">
              <p>{content["label.About_Body_1"]}</p>
              <p>{content["label.About_Body_2"]}</p>
            </div>
            {/* Full width on mobile (the flex column stretches it), intrinsic
                width on desktop. */}
            <div className="flex flex-col md:w-fit">
              {/* No CV file exists yet, so there is nothing to download. */}
              <Button label={content["label.About_DownloadCv"]} onClick={() => {}} />
            </div>
          </div>
        </main>

        <Footer copyright="copyright 2026" tagline="UX · UI · Visual design" />
      </div>
    </div>
  );
}
