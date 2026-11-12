"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/atoms/Icon";

interface MultiSelectProps {
  id: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

/** A dropdown that keeps its picks as removable chips inside the field itself. */
export default function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = "Select",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = (option: string) =>
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    );

  return (
    <div className="multi-select" ref={ref}>
      <div
        id={id}
        className="multi-select__field"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      >
        {value.length === 0 && (
          <span className="multi-select__placeholder">{placeholder}</span>
        )}
        {value.map((v) => (
          <span className="multi-select__chip" key={v}>
            {v}
            <button
              type="button"
              aria-label={`Remove ${v}`}
              onClick={(e) => {
                e.stopPropagation();
                toggle(v);
              }}
            >
              <Icon name="close" size={12} />
            </button>
          </span>
        ))}
      </div>
      {open && (
        <ul
          id={`${id}-list`}
          className="multi-select__list"
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((o) => {
            const selected = value.includes(o);
            return (
              <li
                key={o}
                role="option"
                aria-selected={selected}
                className={
                  selected
                    ? "multi-select__option multi-select__option--selected"
                    : "multi-select__option"
                }
                onClick={() => toggle(o)}
              >
                {o}
                {selected && <Icon name="check" size={14} strokeWidth={3} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
