"use client";

import { useState } from "react";

export default function SaveJobButton() {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      className="button button--soft"
      aria-pressed={saved}
      onClick={() => setSaved((s) => !s)}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
