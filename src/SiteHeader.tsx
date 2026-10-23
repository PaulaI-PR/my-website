import { useState } from "react";
import { Button, Navigation } from "@pikonen/second-design-system";
import { MENU, type Content } from "./content";
import { SearchDialog } from "./SearchDialog";
import { SearchIcon } from "./UiIcons";

// The header every page shares: the design system's Navigation, plus a search
// icon that opens SearchDialog. The icon is passed to Navigation's actions slot
// and sits after the last link.

interface SiteHeaderProps {
  content: Content;
  /** The href of the menu item for the current page, so it reads as active. */
  activeHref?: string;
}

export function SiteHeader({ content, activeHref }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div>
      <Navigation
        siteName={content["label.SiteName"]}
        links={MENU.map((item) => ({
          label: content[item.key],
          href: item.href,
          active: item.href === activeHref,
        }))}
        actions={
          <Button
            shape="icon"
            aria-label={content["label.Search_Open"]}
            onClick={() => setSearchOpen(true)}
            icon={<SearchIcon />}
          />
        }
      />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} content={content} />
    </div>
  );
}
