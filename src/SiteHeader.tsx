import { useState } from "react";
import { Button, Navigation } from "@pikonen/second-design-system";
import { MENU, type Content } from "./content";
import { SearchDialog } from "./SearchDialog";
import { SearchIcon } from "./UiIcons";

// The header every page shares: the design system's Navigation, plus a search
// icon that opens SearchDialog.
//
// STOPGAP, owed to the design system: Navigation takes no children or action
// slot, so the search button cannot sit inside its row. It is placed over the
// row instead. styles.css reserves room at the right of the row (the
// .ds-nav--searchable rule) so the last link does not run under the icon. When
// Navigation gains an actions slot, move the button into it and delete both.

interface SiteHeaderProps {
  content: Content;
  /** The href of the menu item for the current page, so it reads as active. */
  activeHref?: string;
}

export function SiteHeader({ content, activeHref }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="relative">
      <Navigation
        className="ds-nav--searchable"
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === activeHref,
        }))}
      />
      {/* Centred on the 40px link row, which starts at the header's 32px top
          padding. The right inset matches the nav's own, which is 20px on
          mobile and 16px from md. */}
      <div className="absolute top-32 right-20 flex h-40 items-center md:right-16">
        <Button
          shape="icon"
          aria-label={content["label.Search_Open"]}
          onClick={() => setSearchOpen(true)}
          icon={<SearchIcon />}
        />
      </div>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} content={content} />
    </div>
  );
}
