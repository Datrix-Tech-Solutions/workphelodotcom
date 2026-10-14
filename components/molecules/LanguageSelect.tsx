import Select from "@/components/atoms/Select";
import { languages } from "@/lib/navigation";

export default function LanguageSelect() {
  return (
    <div className="language-select">
      <label htmlFor="footer-language" className="sr-only">
        Language
      </label>
      <Select
        id="footer-language"
        name="language"
        defaultValue="en"
        className="language-select__control"
      >
        {languages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
