import type { ReactElement } from "react";

// Inline rather than <img> so the strokes and fills are currentColor and follow
// the colour the Button sets, instead of a hex baked into a file.
const svgProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  "aria-hidden": true,
} as const;

export function InstagramIcon() {
  return (
    <svg {...svgProps}>
      <path
        d="M15.5 4H8.5C6.01472 4 4 6.01472 4 8.5V15.5C4 17.9853 6.01472 20 8.5 20H15.5C17.9853 20 20 17.9853 20 15.5V8.5C20 6.01472 17.9853 4 15.5 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 15.6C13.9882 15.6 15.6 13.9882 15.6 12C15.6 10.0118 13.9882 8.4 12 8.4C10.0118 8.4 8.4 10.0118 8.4 12C8.4 13.9882 10.0118 15.6 12 15.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.8 8.3C17.4075 8.3 17.9 7.80751 17.9 7.2C17.9 6.59249 17.4075 6.1 16.8 6.1C16.1925 6.1 15.7 6.59249 15.7 7.2C15.7 7.80751 16.1925 8.3 16.8 8.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg {...svgProps}>
      <path
        d="M6.5 8.6C7.49411 8.6 8.3 7.79411 8.3 6.8C8.3 5.80589 7.49411 5 6.5 5C5.50589 5 4.7 5.80589 4.7 6.8C4.7 7.79411 5.50589 8.6 6.5 8.6Z"
        fill="currentColor"
      />
      <path d="M8 10H5V19H8V10Z" fill="currentColor" />
      <path
        d="M10.5 10H13.4V11.3C13.9 10.4 15 9.8 16.4 9.8C19.1 9.8 20 11.5 20 14.2V19H17V14.7C17 13.5 16.7 12.7 15.5 12.7C14.3 12.7 13.6 13.5 13.6 14.8V19H10.5V10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg {...svgProps}>
      <path
        d="M12 3.5C10.4908 3.49512 9.00759 3.89214 7.70265 4.65025C6.39771 5.40837 5.31815 6.50024 4.57488 7.81369C3.83161 9.12714 3.45144 10.6148 3.47343 12.1238C3.49542 13.6328 3.91877 15.1088 4.7 16.4L3.5 20.5L7.7 19.4C8.82787 20.0371 10.0864 20.408 11.3796 20.4844C12.6727 20.5607 13.9662 20.3405 15.1612 19.8406C16.3562 19.3406 17.4212 18.5742 18.2747 17.5997C19.1282 16.6253 19.7477 15.4687 20.0859 14.2182C20.424 12.9677 20.4719 11.6565 20.2259 10.3847C19.9799 9.11291 19.4464 7.91417 18.6662 6.88005C17.8861 5.84593 16.8799 5.00381 15.7246 4.418C14.5692 3.83219 13.2953 3.51819 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.3C9.4 7.9 9.7 7.9 10 8L10.9 9.9C11 10.2 10.9 10.4 10.7 10.6L10.2 11.2C10.8 12.4 11.8 13.3 13 13.9L13.6 13.3C13.8 13.1 14.1 13 14.3 13.2L16.1 14.1C16.4 14.3 16.4 14.6 16.3 14.9C15.9 15.9 14.9 16.4 13.9 16.2C11.3 15.6 9.3 13.6 8.5 11C8.4 10.3 8.6 9.5 8.7 8.9L9.2 8.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export type SocialIcon = () => ReactElement;
