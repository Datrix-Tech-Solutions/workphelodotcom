import fs from "node:fs";
import path from "node:path";

const IMAGE_FILE = /\.(png|jpe?g|webp|avif)$/i;

/**
 * Slides for a product page section: every image in
 * public/products/<slug>/<sectionId>/, in filename order.
 */
export function getSectionImages(slug: string, sectionId: string): string[] {
  const dir = path.join(process.cwd(), "public", "products", slug, sectionId);
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => IMAGE_FILE.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => `/products/${slug}/${sectionId}/${file}`);
  } catch {
    return [];
  }
}

/** One image at random from any section of a product page. */
export function getRandomModuleImage(slug: string): string | undefined {
  const dir = path.join(process.cwd(), "public", "products", slug);
  let sections: string[];
  try {
    sections = fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);
  } catch {
    return undefined;
  }
  const pool = sections.flatMap((sectionId) =>
    getSectionImages(slug, sectionId),
  );
  return pool[Math.floor(Math.random() * pool.length)];
}
