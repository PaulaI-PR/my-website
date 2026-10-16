import { Footer, ImageCard, Navigation } from "@pikonen/second-design-system";
import { MENU, useContent } from "./content";

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

// Desktop mosaic placement, in the design's stacking order. Node ids are the
// Image Card instances in Figma. The placement is md:-only: below md the frame
// stacks every tile full-width, which is the flex column's default.
const TILES = [
  { node: "19:150", place: "md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2" },
  { node: "19:56", place: "md:col-start-3 md:row-start-1" },
  { node: "19:154", place: "md:col-start-4 md:row-start-1 md:row-span-2" },
  { node: "19:166", place: "md:col-start-3 md:row-start-2" },
  { node: "19:178", place: "md:col-start-1 md:row-start-3" },
  { node: "19:162", place: "md:col-start-2 md:col-span-2 md:row-start-3" },
  { node: "19:158", place: "md:col-start-4 md:row-start-3 md:row-span-2" },
  { node: "19:174", place: "md:col-start-1 md:row-start-4" },
  { node: "19:182", place: "md:col-start-2 md:row-start-4" },
  { node: "19:170", place: "md:col-start-3 md:row-start-4" },
];

// Placeholder content: every Image Card instance in the design carries the
// component's default photo, so all ten tiles are the same image and share one
// alt string. Swap in a per-tile src/alt — and title/description, which surface
// the card's hover caption and until then show the component's own "Image
// Title" defaults — once there is real work to show.
const TILE_IMAGE = "/assets/portfolio-tile.jpg";
const TILE_ALT = "A lioness resting on open gravel";

export function LandingPage() {
  const content = useContent();

  // Nothing on the page is meaningful without its copy, so the whole page waits
  // rather than painting a header with holes in it. If the fetch fails this stays
  // blank by design — the error is on the console.
  if (!content) return null;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navigation
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({ label: content[item.key], href: item.href }))}
      />

      <div className="mx-auto flex max-w-5xl flex-col gap-32 px-32 py-48 md:gap-8 md:px-48 md:py-32">
        {/* Mobile: one full-width tile per row, each at the 540/418 ratio the
            mobile frame draws — ImageCard has no ratio of its own, so the tile
            sets it. Desktop: the 4 × 4 mosaic. Tiles span two rows or two
            columns, so the rows need a definite height to divide; the grid takes
            the design grid's own proportion (1100 × 856) and min-h-0 stops it
            growing to content instead (it is a flex item, so its min-height
            would otherwise be auto). */}
        <main className="flex flex-col gap-16 md:grid md:aspect-[1100/856] md:min-h-0 md:grid-cols-4 md:grid-rows-4">
          {TILES.map((tile) => (
            // ImageCard takes className, so the grid placement goes straight on
            // it. On desktop size-full makes both axes definite, which
            // overrides the mobile ratio so the card fills a cell of any shape.
            <ImageCard
              key={tile.node}
              src={TILE_IMAGE}
              alt={TILE_ALT}
              className={`aspect-[540/418] md:aspect-auto md:size-full ${tile.place}`}
            />
          ))}
        </main>

        {/* This tagline is longer than the Footer's default, and Footer is one
            row at every width, so on mobile the two halves would squeeze side
            by side. flex-wrap lets the tagline drop under the copyright line
            instead — the stack pinx-ui's Footer used to do itself. */}
        <Footer right="UX · UI · Visual design · Copy" className="flex-wrap gap-x-16" />
      </div>
    </div>
  );
}
