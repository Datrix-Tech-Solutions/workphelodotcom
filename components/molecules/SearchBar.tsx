"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import SearchIcon from "@/components/atoms/SearchIcon";
import Select from "@/components/atoms/Select";
import DateFilter from "@/components/molecules/DateFilter";
import { TYPE_FILTERS } from "@/lib/jobs";

interface SearchBarProps {
  defaultValue?: string;
  location?: string;
  type?: string;
  posted?: string;
  showDateFilter?: boolean;
}

const jobTypes = Object.entries(TYPE_FILTERS).filter(
  ([, f]) => f.field === "jobType",
);
const workModes = Object.entries(TYPE_FILTERS).filter(
  ([, f]) => f.field === "workMode",
);

export default function SearchBar({
  defaultValue,
  location,
  type,
  posted,
  showDateFilter,
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Results follow the typing on the jobs page; elsewhere the search still waits for Enter.
  const live = pathname === "/jobs";

  useEffect(() => () => clearTimeout(timer.current), []);

  /** Re-runs the search shortly after the last change, keeping any open job. */
  function onChange(event: React.FormEvent<HTMLFormElement>) {
    if (!live) return;
    const form = event.currentTarget;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams();
      for (const [key, value] of new FormData(form)) {
        if (typeof value === "string" && value.trim()) {
          params.set(key, value.trim());
        }
      }
      const job = new URLSearchParams(window.location.search).get("job");
      if (job) params.set("job", job);
      const query = params.toString();
      router.replace(query ? `/jobs?${query}` : "/jobs", { scroll: false });
    }, 300);
  }

  return (
    <form
      role="search"
      action="/jobs"
      method="get"
      className="glass-panel search-bar"
      onChange={onChange}
    >
      <div className="search-bar__field search-bar__field--grow">
        <label htmlFor="job-search" className="sr-only">
          Search jobs
        </label>
        <span className="search-bar__icon">
          <SearchIcon />
        </span>
        <Input
          id="job-search"
          name="q"
          type="search"
          placeholder="Search jobs, companies or keywords"
          defaultValue={defaultValue}
          autoComplete="off"
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="job-location" className="sr-only">
          Location
        </label>
        <Input
          id="job-location"
          name="location"
          type="text"
          placeholder="Location"
          defaultValue={location}
          autoComplete="off"
        />
      </div>
      <div className="search-bar__field">
        <label htmlFor="job-type" className="sr-only">
          Job type
        </label>
        <Select
          id="job-type"
          name="type"
          defaultValue={type ?? ""}
          className="search-bar__select"
        >
          <option value="">All job types</option>
          <optgroup label="Job type">
            {jobTypes.map(([value, f]) => (
              <option key={value} value={value}>
                {f.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Work mode">
            {workModes.map(([value, f]) => (
              <option key={value} value={value}>
                {f.label}
              </option>
            ))}
          </optgroup>
        </Select>
      </div>
      {showDateFilter && <DateFilter value={posted} />}
      <Button>Search</Button>
    </form>
  );
}
