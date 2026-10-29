import { Footer } from "@pikonen/second-design-system";
import { useContent } from "./content";
import { ImageGrid } from "./ImageGrid";
import { SiteHeader } from "./SiteHeader";

// Figma: my-website › Landing page (node 13:21) and mobile-landing-page (22:136).
// The two frames are the same page at two widths, so this is one component with
// md: as the seam — below md it follows the 390-wide mobile frame, at md and up
// the 1280-wide desktop frame.
//
// Spacing is the design system's tokens. The design's own values were never on
// the old pinx-ui scale, so they were snapped to it; the move to
// @pikonen/second-design-system keeps those snapped values exactly — every px
// the page rendered before, it renders now:
//
//   design    token   used for
//   8         8       footer bottom padding (exact)
//   10        8       desktop section gaps
//   16, 20    16      tile gaps (mobile 16 exact, desktop 20)
//   24, 27    32      mobile gutters
//   32        32      mobile section gaps (exact)
//   40        48      mobile page vertical padding
//   70, 90    48      desktop footer top padding, desktop gutters
//
// What is now POSSIBLE and is not done here: the new scale has 10, 20, 24 and
// 40 steps, so most rows above could match the design exactly. That changes how
// the page looks rather than repairing it, so it wants its own decision.

export function LandingPage() {
  const content = useContent();

  // Nothing on the page is meaningful without its copy, so the whole page waits
  // rather than painting a header with holes in it. If the fetch fails this stays
  // blank by design — the error is on the console.
  if (!content) return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      <SiteHeader content={content} />

      <div className="mx-auto flex max-w-5xl flex-col gap-32 px-32 py-48 md:gap-8 md:px-48 md:py-32">
        <ImageGrid />

        {/* This tagline is longer than the Footer's default, and Footer is one
            row at every width, so on mobile the two halves would squeeze side
            by side. flex-wrap lets the tagline drop under the copyright line
            instead — the stack pinx-ui's Footer used to do itself. */}
        <Footer right="UX · UI · Visual design · Copy" className="flex-wrap gap-x-16" />
      </div>
    </div>
  );
}
