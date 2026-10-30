/** International dialling codes, for the countries the site offers. */
export const dialCodes: { country: string; code: string }[] = [
  { country: "Australia", code: "+61" },
  { country: "Brazil", code: "+55" },
  { country: "Cameroon", code: "+237" },
  { country: "Canada", code: "+1" },
  { country: "Egypt", code: "+20" },
  { country: "Ethiopia", code: "+251" },
  { country: "France", code: "+33" },
  { country: "Germany", code: "+49" },
  { country: "Ghana", code: "+233" },
  { country: "India", code: "+91" },
  { country: "Ireland", code: "+353" },
  { country: "Kenya", code: "+254" },
  { country: "Netherlands", code: "+31" },
  { country: "Nigeria", code: "+234" },
  { country: "Rwanda", code: "+250" },
  { country: "Senegal", code: "+221" },
  { country: "South Africa", code: "+27" },
  { country: "Tanzania", code: "+255" },
  { country: "Uganda", code: "+256" },
  { country: "United Arab Emirates", code: "+971" },
  { country: "United Kingdom", code: "+44" },
  { country: "United States", code: "+1" },
];

export const DEFAULT_DIAL_COUNTRY = "Ghana";

export const dialCodeOf = (country: string) =>
  dialCodes.find((d) => d.country === country)?.code;

/** Splits a saved number like "+233 24 000 0000" into its country and the rest. */
export function splitPhone(phone: string): { country: string; number: string } {
  const compact = phone.replace(/[\s().-]/g, "");
  // The longest matching code wins, so +1 never swallows +1-something longer.
  const match = [...dialCodes]
    .sort((a, b) => b.code.length - a.code.length)
    .find((d) => compact.startsWith(d.code));
  return match
    ? { country: match.country, number: compact.slice(match.code.length) }
    : { country: DEFAULT_DIAL_COUNTRY, number: compact.replace(/^\+/, "") };
}
