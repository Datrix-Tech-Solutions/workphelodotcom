"use client";

import { useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { POSTED_OPTIONS } from "@/lib/jobs";

interface DateFilterProps {
  /** Current `posted` search param, e.g. `7d`, `year:2025` or `date:2026-10-01`. */
  value?: string;
}

const thisYear = new Date().getFullYear();

/** Splits a `posted` param into the select's choice and its extra value. */
function parse(value = ""): { choice: string; extra: string } {
  const [choice, extra = ""] = value.split(":");
  return { choice, extra };
}

export default function DateFilter({ value }: DateFilterProps) {
  const initial = parse(value);
  const [choice, setChoice] = useState(initial.choice);
  const [year, setYear] = useState(
    initial.choice === "year" ? initial.extra : String(thisYear),
  );
  const [date, setDate] = useState(
    initial.choice === "date" ? initial.extra : "",
  );

  let posted = choice;
  if (choice === "year") posted = year ? `year:${year}` : "";
  else if (choice === "date") posted = date ? `date:${date}` : "";

  return (
    <>
      <div className="search-bar__field">
        <label htmlFor="job-posted" className="sr-only">
          Date posted
        </label>
        <Select
          id="job-posted"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          className="search-bar__select"
        >
          <option value="">Any date</option>
          {POSTED_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        {choice === "year" && (
          <Input
            type="number"
            aria-label="Year"
            min={2000}
            max={thisYear}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="search-bar__year"
          />
        )}
        {choice === "date" && (
          <Input
            type="date"
            aria-label="Date posted"
            max={new Date().toISOString().slice(0, 10)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="search-bar__date"
          />
        )}
      </div>
      {posted && <input type="hidden" name="posted" value={posted} />}
    </>
  );
}
