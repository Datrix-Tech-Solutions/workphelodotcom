"use client";

import { useState } from "react";
import { parseResume, type ParsedResume } from "@/lib/resume/parse";
import {
  extractResumeText,
  RESUME_ACCEPT,
  ResumeReadError,
} from "@/lib/resume/extractText";

interface ResumeAutofillProps {
  onParsed: (parsed: ParsedResume, text: string) => void;
}

export default function ResumeAutofill({ onParsed }: ResumeAutofillProps) {
  const [status, setStatus] = useState<{
    kind: "idle" | "reading" | "done" | "error";
    message: string;
  }>({ kind: "idle", message: "" });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setStatus({ kind: "reading", message: "Reading your resume…" });
    try {
      const text = await extractResumeText(file);
      const parsed = parseResume(text);
      onParsed(parsed, text);
      const found = parsed.education.length + parsed.experience.length;
      setStatus({
        kind: "done",
        message:
          found > 0
            ? `Found ${parsed.experience.length} role${parsed.experience.length === 1 ? "" : "s"} and ${parsed.education.length} qualification${parsed.education.length === 1 ? "" : "s"}. Please check them below.`
            : "We couldn't find an education or work history section. You can add them below.",
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message:
          error instanceof ResumeReadError
            ? error.message
            : "We couldn't read that file. You can fill the details in below.",
      });
    }
  };

  return (
    <div className="resume-autofill">
      <label htmlFor="resume-autofill" className="form-field__label">
        Autofill from your resume
      </label>
      <input
        id="resume-autofill"
        type="file"
        accept={RESUME_ACCEPT}
        disabled={status.kind === "reading"}
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <p className="form-field__hint">
        PDF or DOCX, up to 5 MB. It&apos;s read in your browser to fill in your
        education and work history. The file isn&apos;t uploaded.
      </p>
      {status.message && (
        <p
          className={`resume-autofill__status ${
            status.kind === "error" ? "resume-autofill__status--error" : ""
          }`}
          role="status"
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
