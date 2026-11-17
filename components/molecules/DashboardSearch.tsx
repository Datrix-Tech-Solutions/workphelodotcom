import SearchIcon from "@/components/atoms/SearchIcon";

/** A search box for a dashboard list. It submits as a GET, so the URL holds the search. */
export default function DashboardSearch({
  query,
  placeholder = "Search your jobs",
}: {
  query: string;
  placeholder?: string;
}) {
  return (
    <form
      className="dashboard__search"
      role="search"
      action="/dashboard"
      method="get"
    >
      <SearchIcon size={16} />
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field-control"
      />
    </form>
  );
}
