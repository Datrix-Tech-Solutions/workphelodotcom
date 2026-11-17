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
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setSearch("");
      return;
    }
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const needle = search.trim().toLowerCase();
  const shown = needle
    ? options.filter((o) => o.toLowerCase().includes(needle))
    : options;

  const toggle = (option: string) =>
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    );

  return (
    <div className="multi-select" ref={ref}>
      <div
        className="multi-select__field"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
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
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          autoComplete="off"
          className="multi-select__input"
          value={search}
          placeholder={value.length === 0 ? placeholder : ""}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Enter picks the first match instead of submitting the form.
              e.preventDefault();
              if (open && shown[0]) {
                toggle(shown[0]);
                setSearch("");
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            } else if (e.key === "Backspace" && !search && value.length > 0) {
              onChange(value.slice(0, -1));
            }
          }}
        />
      </div>
      {open && (
        <ul
          id={`${id}-list`}
          className="multi-select__list"
          role="listbox"
          aria-multiselectable="true"
        >
          {shown.length === 0 && (
            <li className="multi-select__empty" role="presentation">
              No matches
            </li>
          )}
          {shown.map((o) => {
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
                onClick={() => {
                  toggle(o);
                  setSearch("");
                  inputRef.current?.focus();
                }}
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
