import type { Job } from "@/lib/jobs";

/**
 * Words that point to an industry. Open jobs from the HR API carry no industry, so these
 * are matched against the title, company and description. Adverts set one directly.
 */
const KEYWORDS: Record<string, string[]> = {
  Technology: [
    "software", "developer", "engineer", "frontend", "backend", "full stack",
    "devops", "data scientist", "data analyst", "cloud", "cyber", "it support",
    "programmer", "ux", "ui designer", "product manager", "technology",
  ],
  "Finance & Banking": [
    "finance", "financial", "bank", "banking", "accountant", "accounting",
    "audit", "auditor", "investment", "insurance", "credit", "treasury", "loan",
  ],
  Healthcare: [
    "health", "nurse", "doctor", "medical", "clinic", "hospital", "pharmac",
    "physician", "dental", "patient", "midwife", "laboratory",
  ],
  Education: [
    "teacher", "lecturer", "school", "university", "education", "tutor",
    "academic", "curriculum", "instructor", "training",
  ],
  "Retail & E-commerce": [
    "retail", "e-commerce", "ecommerce", "store", "merchandis", "cashier",
    "sales assistant", "shop",
  ],
  Manufacturing: [
    "manufactur", "factory", "production", "plant operator", "assembly",
    "machinist", "quality control",
  ],
  "Energy & Utilities": [
    "energy", "oil", "gas", "solar", "power", "utilities", "electrical",
    "renewable",
  ],
  "Mining & Minerals": [
    "mining", "mine ", "miner", "mineral", "quarry", "gold", "bauxite",
    "manganese", "geologist", "geology", "geotechnical", "metallurg",
    "drill", "blast", "excavat", "ore ", "smelter", "exploration",
    "mine planning", "mineral processing", "heavy equipment operator",
  ],
  Telecommunications: [
    "telecom", "network engineer", "mobile network", "fibre", "fiber",
    "wireless", "broadband",
  ],
  "Media & Entertainment": [
    "media", "journalist", "editor", "content", "video", "film", "broadcast",
    "entertainment", "music", "producer", "creative",
  ],
  "Hospitality & Travel": [
    "hotel", "hospitality", "restaurant", "chef", "tourism", "travel", "waiter",
    "catering", "front desk", "airline",
  ],
  Agriculture: [
    "agric", "farm", "crop", "livestock", "agronom", "horticulture",
  ],
  "Construction & Real Estate": [
    "construction", "civil engineer", "architect", "real estate", "property",
    "surveyor", "site engineer", "estate agent",
  ],
  "Logistics & Transportation": [
    "logistics", "driver", "transport", "supply chain", "warehouse", "freight",
    "delivery", "dispatch", "fleet",
  ],
  "Non-profit": [
    "non-profit", "nonprofit", "ngo", "charity", "foundation", "humanitarian",
    "community development",
  ],
  Government: [
    "government", "ministry", "public sector", "municipal", "civil service",
    "policy officer",
  ],
  "Legal Services": [
    "lawyer", "attorney", "legal", "paralegal", "solicitor", "barrister",
    "law firm", "compliance", "litigation", "advocate",
  ],
  "Consulting & Professional Services": [
    "consultant", "consulting", "advisory", "business analyst", "management consult",
    "professional services",
  ],
  "Marketing & Advertising": [
    "marketing", "advertising", "brand manager", "social media", "seo",
    "copywriter", "public relations", "digital marketing", "campaign",
  ],
  "Human Resources & Recruitment": [
    "human resources", "recruiter", "recruitment", "talent acquisition",
    "hr manager", "hr officer", "payroll", "staffing", "headhunt",
  ],
  "Pharmaceuticals & Biotech": [
    "pharmaceutical", "biotech", "biotechnology", "clinical research",
    "drug", "regulatory affairs", "life sciences",
  ],
  "Food & Beverage": [
    "food", "beverage", "brewery", "bakery", "food processing",
    "food safety", "bottling", "confectionery",
  ],
  Automotive: [
    "automotive", "mechanic", "vehicle", "car dealership", "auto parts",
    "motor", "panel beater",
  ],
  "Aviation & Aerospace": [
    "aviation", "aerospace", "pilot", "aircraft", "air traffic", "cabin crew",
    "avionics", "airport",
  ],
  "Security & Defense": [
    "security guard", "security officer", "defense", "defence", "military",
    "surveillance", "armed response", "police",
  ],
  "Environment & Sustainability": [
    "environmental", "sustainability", "climate", "conservation", "waste management",
    "recycling", "ecolog", "esg",
  ],
  "Fashion & Textiles": [
    "fashion", "textile", "garment", "apparel", "tailor", "clothing",
    "fashion designer",
  ],
  "Sports & Fitness": [
    "fitness", "personal trainer", "coach", "sports", "athlete", "gym",
    "wellness",
  ],
};

/** Whether a job is in any of the industries a candidate picked. */
export function matchesIndustries(job: Job, picked: string[]): boolean {
  if (picked.length === 0) return false;
  if (job.industry) return picked.includes(job.industry);
  const text = `${job.title} ${job.company} ${job.description}`.toLowerCase();
  return picked.some((industry) =>
    (KEYWORDS[industry] ?? []).some((word) => text.includes(word)),
  );
}
