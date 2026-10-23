import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { Button, Input } from "@pikonen/second-design-system";
import type { Content } from "./content";
import { CloseIcon } from "./UiIcons";

// STOPGAP, owed to the design system: the package has no Modal. This is built on
// the native <dialog> element, which gives the modal behaviour for free — focus
// stays inside it, Escape closes it, and the page behind it is inert. The form
// inside uses the design system's Input and Button.
//
// Raise a Modal with the design system; when it ships, replace this file.
//
// Closing: Escape and the close button both route through onClose. A click on
// the backdrop lands on the <dialog> itself, because the inner div fills it and
// has the padding, so target === dialog means "outside the content".

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  content: Content;
}

export function SearchDialog({ open, onClose, content }: SearchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [term, setTerm] = useState("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // The field is mounted while the dialog is closed, so an autoFocus
      // attribute would fire before it is visible. Focus it once it is open.
      dialog.querySelector<HTMLInputElement>("input[type=search]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = term.trim();
    if (!query) {
      setError(content["error.Search_Empty"]);
      return;
    }
    setError(undefined);
    window.location.hash = `#/search?q=${encodeURIComponent(query)}`;
    onClose();
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleClick}
      aria-labelledby="search-dialog-title"
      className="m-auto w-[calc(100%-32px)] max-w-[560px] rounded-md bg-white p-0 backdrop:bg-slate-900/40"
    >
      <div className="flex flex-col gap-24 p-24">
        <div className="flex items-center justify-between gap-16">
          <h2 id="search-dialog-title" className="text-large text-slate-900">
            {content["label.Search_Title"]}
          </h2>
          <Button shape="icon" aria-label={content["label.Search_Close"]} onClick={onClose} icon={<CloseIcon />} />
        </div>

        <form onSubmit={submit} noValidate>
          <Input
            type="search"
            label={content["label.Search_Field"]}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={content["label.Search_Placeholder"]}
            autoComplete="off"
            helperText={error}
            aria-invalid={error ? true : undefined}
            className={error ? "field-error" : undefined}
            action={<Button type="submit">{content["label.Search_Submit"]}</Button>}
          />
        </form>
      </div>
    </dialog>
  );
}
