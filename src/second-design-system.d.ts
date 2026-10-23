// Type declarations for @pikonen/second-design-system, which ships plain
// JavaScript with no .d.ts. Written by hand from the published dist/index.js
// (0.1.1) — every prop and default below is read from that source, none is
// guessed. This file is a stopgap: the types belong in the package itself, and
// once it ships them this file should be deleted.
//
// Every component spreads its remaining props onto its root (or, for Input
// and Textarea, onto the native field), so each extends the matching native
// element's attributes.

declare module "@pikonen/second-design-system" {
  import type {
    ButtonHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    JSX,
    ReactNode,
    TextareaHTMLAttributes,
  } from "react";

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Default "default". */
    variant?: "default" | "destructive" | "outline" | "subtle" | "ghost" | "link";
    /** Default "default". The icon shapes render `icon` only, never children. */
    shape?: "default" | "icon" | "icon-circle";
    icon?: ReactNode;
    /** Shows a spinner in place of `icon`, and disables the button. */
    loading?: boolean;
  }
  export function Button(props: ButtonProps): JSX.Element;

  /** Props land on the <input>; `className` lands on the wrapper. */
  export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: ReactNode;
    /** Rendered under the field and linked to it with aria-describedby. */
    helperText?: ReactNode;
    /** Default "default" (40px); "small" is 32px. */
    size?: "default" | "small";
    /** Default "top". */
    labelPosition?: "top" | "left";
    /** Rendered beside the field, e.g. a Button. */
    action?: ReactNode;
  }
  export function Input(props: InputProps): JSX.Element;

  /** Props land on the <textarea>; `className` lands on the wrapper. */
  export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: ReactNode;
    helperText?: ReactNode;
  }
  export function Textarea(props: TextareaProps): JSX.Element;

  /** Props land on the <input type="radio">; `className` lands on the <label>. */
  export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: ReactNode;
  }
  export function RadioButton(props: RadioButtonProps): JSX.Element;

  export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
    /** Default "neutral". */
    variant?: "neutral" | "primary" | "secondary";
  }
  export function Tag(props: TagProps): JSX.Element;

  export interface NavigationLink {
    label: ReactNode;
    /** Also the list key, so it must be unique within `links`. */
    href: string;
    /** Sets aria-current="page" and the filled style. */
    active?: boolean;
  }
  export interface NavigationProps extends HTMLAttributes<HTMLElement> {
    /** Default "PINX Design". */
    siteName?: ReactNode;
    /** Rendered as the last item of the link list, e.g. an icon Button. */
    actions?: ReactNode;
    /** Default "/". */
    siteHref?: string;
    /** Defaults to Work / About / Contact placeholders. */
    links?: NavigationLink[];
  }
  export function Navigation(props: NavigationProps): JSX.Element;

  export interface FooterProps extends HTMLAttributes<HTMLElement> {
    /** Default "copyright 2026". */
    left?: ReactNode;
    /** Default "UX · UI · Visual design". */
    right?: ReactNode;
  }
  export function Footer(props: FooterProps): JSX.Element;

  export interface ImageCardProps extends HTMLAttributes<HTMLElement> {
    src: string;
    alt?: string;
    /** Default "Image Title". Shown in the hover caption. */
    title?: string;
    /** Default "A short description of the image.". */
    description?: string;
    /** Keeps the caption visible rather than only on hover / focus. */
    showCaption?: boolean;
  }
  export function ImageCard(props: ImageCardProps): JSX.Element;
}
