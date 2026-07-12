"use client";

import { useState } from "react";

export function PulseDot() {
  const [pulses, setPulses] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setPulses((n) => n + 1)}
      className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-ink transition-transform duration-200 active:scale-90 motion-reduce:transition-none"
    >
      <span
        key={pulses}
        className={`h-4 w-4 rounded-full bg-electron ${pulses > 0 ? "animate-ping-once" : ""}`}
      />
      <span className="absolute -bottom-8 text-sm text-graphite" aria-live="polite">
        {pulses === 0 ? "click me" : `${pulses} pulse${pulses === 1 ? "" : "s"}`}
      </span>
    </button>
  );
}
