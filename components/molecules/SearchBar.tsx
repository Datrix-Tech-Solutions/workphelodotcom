import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import SearchIcon from "@/components/atoms/SearchIcon";

interface SearchBarProps {
  defaultValue?: string;
}

export default function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <form
      role="search"
      action="/jobs"
      method="get"
      className="glass-panel search-bar"
    >
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
      <Button>Search</Button>
    </form>
  );
}
