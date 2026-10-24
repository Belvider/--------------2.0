"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

let scrollLocks = 0;
let previousOverflow = "";
const openDialogs: HTMLElement[] = [];

type AccessibleDialogProps = {
  children: ReactNode;
  className?: string;
  label: string;
  onClose: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  restoreFocus?: boolean | (() => boolean);
};

export function AccessibleDialog({ children, className, label, onClose, initialFocusRef, restoreFocus = true }: AccessibleDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const restoreFocusRef = useRef(restoreFocus);
  restoreFocusRef.current = restoreFocus;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (scrollLocks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    openDialogs.push(dialog);

    const focusables = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter((element) => element.tabIndex !== -1 && element.getClientRects().length > 0);
    (initialFocusRef?.current ?? focusables()[0] ?? dialog).focus();

    function handleKey(event: KeyboardEvent) {
      if (openDialogs.at(-1) !== dialog) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (event.key === "Tab") {
        const elements = focusables();
        const first = elements[0] ?? dialog;
        const last = elements.at(-1) ?? dialog;
        if (!elements.length || !dialog?.contains(document.activeElement) ||
          (event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
      }
    }
    function handleFocus(event: FocusEvent) {
      if (openDialogs.at(-1) === dialog && event.target instanceof Node && !dialog?.contains(event.target)) {
        (focusables()[0] ?? dialog)?.focus();
      }
    }
    document.addEventListener("keydown", handleKey, true);
    document.addEventListener("focusin", handleFocus);
    return () => {
      document.removeEventListener("keydown", handleKey, true);
      document.removeEventListener("focusin", handleFocus);
      const index = openDialogs.indexOf(dialog);
      if (index >= 0) openDialogs.splice(index, 1);
      if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
      const restore = restoreFocusRef.current;
      if ((typeof restore === "function" ? restore() : restore) && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [initialFocusRef]);

  return <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
    className={className} onClick={(event) => event.stopPropagation()}>{children}</div>;
}
