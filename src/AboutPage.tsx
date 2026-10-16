import { Button, Footer, Navigation } from "@pikonen/second-design-system";
import { MENU, useContent } from "./content";

// Figma: my-website › About — Desktop (node 114:1118) and About — Mobile
// (114:1180). Same page at two widths, so one component with md: as the seam:
// below md the portrait stacks above the text, at md and up they sit side by
// side in two equal columns.
//
// The frames are drawn in the design system's own palette, fonts and spacing,
// so every value here is the frame's, unrounded: colours and spacing are the
// package's tokens, type is the Figma text styles (see styles.css), and the
// quote is the package's own `.quote` class, which switches between
// quote/mobile and quote/desktop by itself.
//
// The portrait is 358 × 448 on mobile and 432 × 540 on desktop — both 4:5 —
// so it is a ratio rather than two fixed heights.

export function AboutPage() {
  const content = useContent();

  if (!content) return null;

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navigation
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === "#/about",
        }))}
      />

      {/* The frame's 960px content column. On mobile it is the full width, so
          the footer spans the screen, as the mobile frame draws it. */}
      <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-40 px-16 pt-16 pb-40 md:flex-row md:items-start md:gap-64 md:pt-24 md:pb-48">
          {/* Stands in for the portrait until there is a photo; swap for an
              <img> at the same 4:5 ratio. */}
          <div className="flex aspect-[4/5] w-full items-center justify-center rounded-md bg-slate-200 md:flex-1">
            <p className="text-subtle text-slate-500">
              {content["label.About_PortraitPlaceholder"]}
            </p>
          </div>

          <div className="flex flex-col gap-32 md:flex-1">
            <h1 className="text-h1 text-slate-900">{content["label.About_Title"]}</h1>
            <blockquote className="quote text-slate-900">{content["label.About_Quote"]}</blockquote>
            <p className="text-lead text-slate-500">{content["label.About_Lead"]}</p>
            <div className="flex flex-col gap-16 text-p text-slate-800">
              <p>{content["label.About_Body_1"]}</p>
              <p>{content["label.About_Body_2"]}</p>
            </div>
            {/* No CV file exists yet, so there is nothing to download. Full
                width on mobile, intrinsic width on desktop, as in the frames. */}
            <Button className="w-full md:w-fit">{content["label.About_DownloadCv"]}</Button>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
