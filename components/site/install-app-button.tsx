"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Reading browser-only globals (matchMedia, navigator) has to happen
    // after mount — they don't exist during server rendering, so this
    // can't be computed any other way without a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
        !("MSStream" in window),
    );

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone) return null; // Already installed — nothing to do.

  async function handleClick() {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      setDeferredPrompt(null);
      return;
    }
    // No native prompt available (iOS Safari, or a browser that doesn't
    // support it) — show manual steps instead.
    setShowInstructions(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex items-center gap-0.2 text-sm font-medium text-[var(--color-navy)] hover:text-[var(--color-forest)] ${className}`}
      >
        <Download className="h-4 w-4" /> Download App
      </button>

      {showInstructions ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          onClick={() => setShowInstructions(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="font-display text-base font-semibold text-[var(--color-navy)]">
                Install this app
              </h2>
              <button
                onClick={() => setShowInstructions(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5 text-[var(--color-ink-soft)]" />
              </button>
            </div>

            {isIOS ? (
              <p className="mt-3 flex items-start gap-2 text-sm text-[var(--color-ink-soft)]">
                <Share className="mt-0.5 h-4 w-4 shrink-0" />
                Tap the Share button in Safari, then choose{" "}
                <strong className="text-[var(--color-navy)]">
                  &ldquo;Add to Home Screen&rdquo;
                </strong>
                .
              </p>
            ) : (
              <p className="mt-3 text-sm text-[var(--color-ink-soft)]">
                Open your browser&apos;s menu (usually ⋮ or ···) and look for{" "}
                <strong className="text-[var(--color-navy)]">
                  &ldquo;Install app&rdquo;
                </strong>{" "}
                or{" "}
                <strong className="text-[var(--color-navy)]">
                  &ldquo;Add to Home Screen&rdquo;
                </strong>
                .
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
