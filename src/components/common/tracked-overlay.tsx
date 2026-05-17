"use client";

import { useEffect, useRef } from "react";

const TRACK_SELECTOR = ".tracked";
const PADDING = 6;

type Entry = {
  el: HTMLElement;
  overlay: HTMLDivElement;
  label: HTMLDivElement;
};

export function TrackedOverlay() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const layer = layerRef.current;
    if (!layer) return;

    const entries = new Map<HTMLElement, Entry>();
    let scheduled = false;

    const createOverlay = (el: HTMLElement): Entry => {
      const overlay = document.createElement("div");
      overlay.className = "tracked-overlay";
      overlay.innerHTML = `
        <span class="tracked-overlay__corner tracked-overlay__corner--tl"></span>
        <span class="tracked-overlay__corner tracked-overlay__corner--tr"></span>
        <span class="tracked-overlay__corner tracked-overlay__corner--bl"></span>
        <span class="tracked-overlay__corner tracked-overlay__corner--br"></span>
      `;
      const label = document.createElement("div");
      label.className = "tracked-overlay__label";
      layer.appendChild(overlay);
      layer.appendChild(label);
      return { el, overlay, label };
    };

    const updateEntry = (entry: Entry) => {
      const rect = entry.el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        entry.overlay.style.opacity = "0";
        entry.label.style.opacity = "0";
        return;
      }

      entry.overlay.style.opacity = "1";
      entry.label.style.opacity = "1";
      entry.overlay.style.transform = `translate3d(${rect.left - PADDING}px, ${rect.top - PADDING}px, 0)`;
      entry.overlay.style.width = `${rect.width + PADDING * 2}px`;
      entry.overlay.style.height = `${rect.height + PADDING * 2}px`;

      const tag = entry.el.dataset.trackedLabel ?? entry.el.tagName.toLowerCase();
      entry.label.textContent = `${tag.toUpperCase()} | W: ${Math.round(
        rect.width
      )}px H: ${Math.round(rect.height)}px | X: ${Math.round(
        rect.left
      )} Y: ${Math.round(rect.top)}`;
      entry.label.style.transform = `translate3d(${rect.left - PADDING}px, ${
        rect.top - PADDING - 16
      }px, 0)`;
    };

    const updateAll = () => {
      scheduled = false;
      entries.forEach(updateEntry);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(updateAll);
    };

    const resizeObserver = new ResizeObserver(() => schedule());

    const syncEntries = () => {
      const nodes = document.querySelectorAll<HTMLElement>(TRACK_SELECTOR);
      const seen = new Set<HTMLElement>();

      nodes.forEach((el) => {
        seen.add(el);
        if (!entries.has(el)) {
          const entry = createOverlay(el);
          entries.set(el, entry);
          resizeObserver.observe(el);
        }
      });

      entries.forEach((entry, key) => {
        if (!seen.has(key)) {
          resizeObserver.unobserve(key);
          entry.overlay.remove();
          entry.label.remove();
          entries.delete(key);
        }
      });

      schedule();
    };

    syncEntries();

    const mo = new MutationObserver(() => syncEntries());
    mo.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "data-tracked-label"],
    });

    const onScroll = () => schedule();
    const onResize = () => schedule();

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize);

    return () => {
      mo.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      entries.forEach((entry) => {
        entry.overlay.remove();
        entry.label.remove();
      });
      entries.clear();
    };
  }, []);

  return <div ref={layerRef} className="tracked-layer" aria-hidden="true" />;
}
