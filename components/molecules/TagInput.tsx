"use client";

import { useState } from "react";
import Icon from "@/components/atoms/Icon";

interface TagInputProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

/** Type a value and press Enter (or a comma) to add it as a removable tag. */
export default function TagInput({
  id,
  value,
  onChange,
  placeholder,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function add() {
    const tag = draft.trim();
    setDraft("");
    if (tag && !value.some((v) => v.toLowerCase() === tag.toLowerCase())) {
      onChange([...value, tag]);
    }
  }

  return (
    <div className="tag-input">
      {value.map((tag) => (
        <span className="tag-input__tag" key={tag}>
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((v) => v !== tag))}
          >
            <Icon name="close" size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        className="tag-input__field"
        placeholder={value.length === 0 ? placeholder : undefined}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
      />
    </div>
  );
}
