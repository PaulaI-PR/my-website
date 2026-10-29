import { ImageCard } from "@pikonen/second-design-system";
import { CASES, CASE_IMAGE, CASE_IMAGE_ALT } from "./cases";

// Local stand-in for the design's ComponentImageGrid, which the design system
// does not ship yet. When it does, replace this file with the real component.
//
// Desktop: a 4 x 4 mosaic of nine tiles (Figma ComponentImageGrid). Below md
// every tile stacks full-width at the 540/418 ratio of the mobile frame.
// `place` is md:-only and sits on the link, which is the grid item. Each tile
// links into a case study page.
const TILES = [
  { id: "tile-1", place: "md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2" },
  { id: "tile-2", place: "md:col-start-3 md:row-start-1" },
  { id: "tile-3", place: "md:col-start-3 md:row-start-2" },
  { id: "tile-4", place: "md:col-start-4 md:row-start-1 md:row-span-2" },
  { id: "tile-5", place: "md:col-start-1 md:row-start-3" },
  { id: "tile-6", place: "md:col-start-2 md:col-span-2 md:row-start-3" },
  { id: "tile-7", place: "md:col-start-4 md:row-start-3 md:row-span-2" },
  { id: "tile-8", place: "md:col-start-1 md:col-span-2 md:row-start-4" },
  { id: "tile-9", place: "md:col-start-3 md:row-start-4" },
];

export function ImageGrid() {
  return (
    <div className="flex flex-col gap-16 md:grid md:aspect-[916/856] md:min-h-0 md:grid-cols-4 md:grid-rows-4 md:gap-20">
      {TILES.map((tile, index) => {
        const item = CASES[index % CASES.length];

        return (
          <a key={tile.id} href={`#/case/${item.id}`} aria-label={item.title} className={`block ${tile.place}`}>
            <ImageCard
              src={CASE_IMAGE}
              alt={CASE_IMAGE_ALT}
              title={item.title}
              description={item.tags.join(" · ")}
              className="aspect-[540/418] md:aspect-auto md:size-full"
            />
          </a>
        );
      })}
    </div>
  );
}
