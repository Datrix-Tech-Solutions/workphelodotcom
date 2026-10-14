const PDF_TYPES = [".pdf"];
const DOCX_TYPES = [".docx"];

export const RESUME_ACCEPT = ".pdf,.docx";
export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export class ResumeReadError extends Error {}

/** Returns an error message, or null when the file can be read. */
export function validateResume(file: File): string | null {
  const name = file.name.toLowerCase();
  if (![...PDF_TYPES, ...DOCX_TYPES].some((ext) => name.endsWith(ext))) {
    return "Please upload a PDF or DOCX file.";
  }
  if (file.size > MAX_RESUME_BYTES) return "That file is larger than 5 MB.";
  return null;
}

async function pdfText(data: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const doc = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await (await doc.getPage(n)).getTextContent();
    // Keep line breaks: items on a new baseline start a new line.
    let text = "";
    let lastY: number | null = null;
    for (const item of page.items) {
      if (!("str" in item)) continue;
      const y = item.transform[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) text += "\n";
      else if (text && !text.endsWith(" ")) text += " ";
      text += item.str;
      lastY = y;
    }
    pages.push(text);
  }
  return pages.join("\n");
}

async function docxText(data: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser");
  const result = await mammoth.extractRawText({ arrayBuffer: data });
  return result.value;
}

/** Reads the text of a PDF or DOCX resume in the browser. The file is not uploaded. */
export async function extractResumeText(file: File): Promise<string> {
  const problem = validateResume(file);
  if (problem) throw new ResumeReadError(problem);

  const data = await file.arrayBuffer();
  const text = file.name.toLowerCase().endsWith(".pdf")
    ? await pdfText(data)
    : await docxText(data);

  if (text.trim().length < 20) {
    throw new ResumeReadError(
      "We couldn't read any text in that file. It may be a scan or image.",
    );
  }
  return text;
}
