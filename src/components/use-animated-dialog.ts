"use client";

import { useEffect, useRef } from "react";

/**
 * Opens a native <dialog> as a modal and plays a CSS exit animation before closing it.
 * The closing state is exposed as `data-closing` so CSS can animate both directions.
 */
export function useAnimatedDialog(isOpen: boolean, onClose: () => void, exitMs = 300) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.removeAttribute("data-closing");
      if (!dialog.open) dialog.showModal();
      return;
    }

    if (!dialog.open) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    dialog.setAttribute("data-closing", "");
    const timeout = window.setTimeout(
      () => {
        dialog.close();
        dialog.removeAttribute("data-closing");
      },
      reduced ? 0 : exitMs,
    );

    return () => window.clearTimeout(timeout);
  }, [isOpen, exitMs]);

  return {
    ref,
    onCancel: (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onClose();
    },
    onClick: (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
  };
}
