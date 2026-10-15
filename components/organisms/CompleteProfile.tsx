"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  profileDocumentUrl,
  removeProfileDocument,
  saveProfileSection,
  uploadProfileDocument,
} from "@/app/profile/actions";
import Button from "@/components/atoms/Button";
import Icon from "@/components/atoms/Icon";
import FormField from "@/components/molecules/FormField";
import {
  DOCUMENTS,
  DOCUMENT_EXTENSIONS,
  MAX_DOCUMENT_BYTES,
  MAX_ENTRIES,
  SECTIONS,
  type CandidateDetails,
  type DocumentKind,
  type Entry,
  type SectionKey,
} from "@/lib/candidateDetailsConfig";

type PanelKey = SectionKey | DocumentKind;

const ORDER: PanelKey[] = [
  "education",
  "career",
  "certificates",
  "resume",
  "cover_letter",
];

function titleOf(key: PanelKey): string {
  return key in SECTIONS
    ? SECTIONS[key as SectionKey].title
    : DOCUMENTS[key as DocumentKind].title;
}

export default function CompleteProfile({
  initial,
}: {
  initial: CandidateDetails;
}) {
  const router = useRouter();
  const [details, setDetails] = useState(initial);
  const [open, setOpen] = useState<PanelKey | null>(null);

  const complete: Record<PanelKey, boolean> = {
    education: details.education.length > 0,
    career: details.career.length > 0,
    certificates: details.certificates.length > 0,
    resume: !!details.resume,
    cover_letter: !!details.coverLetter,
  };
  const done = ORDER.filter((k) => complete[k]).length;

  return (
    <section
      className="profile-card profile-card--full"
      aria-labelledby="complete-profile"
    >
      <h2 id="complete-profile" className="profile-card__title">
        Complete your profile
      </h2>

      <div className="complete__progress">
        <div
          className="complete__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ORDER.length}
          aria-valuenow={done}
          aria-label="Profile completion"
        >
          <span style={{ width: `${(done / ORDER.length) * 100}%` }} />
        </div>
        <p className="complete__count">
          {done} of {ORDER.length} sections complete
        </p>
      </div>

      <ul className="complete__list">
        {ORDER.map((key) => {
          const isOpen = open === key;
          return (
            <li key={key} className="complete__item">
              <button
                type="button"
                className="complete__header"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : key)}
              >
                <span
                  className={`complete__tick${complete[key] ? " complete__tick--done" : ""}`}
                  aria-hidden="true"
                >
                  {complete[key] && (
                    <Icon name="check" size={12} strokeWidth={3} />
                  )}
                </span>
                <span className="complete__label">{titleOf(key)}</span>
                <span
                  className={`complete__chevron${isOpen ? " complete__chevron--open" : ""}`}
                  aria-hidden="true"
                >
                  <Icon name="chevron-right" size={16} />
                </span>
              </button>
              {isOpen && (
                <div className="complete__body">
                  {key === "resume" || key === "cover_letter" ? (
                    <DocumentPanel
                      kind={key}
                      file={
                        key === "resume" ? details.resume : details.coverLetter
                      }
                      onChange={(file) => {
                        setDetails((d) =>
                          key === "resume"
                            ? { ...d, resume: file }
                            : { ...d, coverLetter: file },
                        );
                        router.refresh();
                      }}
                    />
                  ) : (
                    <EntryPanel
                      section={key}
                      entries={details[key]}
                      onChange={(entries) => {
                        setDetails((d) => ({ ...d, [key]: entries }));
                        router.refresh();
                      }}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* Education / career / certificates ---------------------------------------- */

function EntryPanel({
  section,
  entries,
  onChange,
}: {
  section: SectionKey;
  entries: Entry[];
  onChange: (entries: Entry[]) => void;
}) {
  const config = SECTIONS[section];
  const formId = useId();
  // null = list view, -1 = adding, >= 0 = editing that index.
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Entry>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function begin(index: number) {
    setDraft(index >= 0 ? { ...entries[index] } : {});
    setError("");
    setEditing(index);
  }

  async function persist(next: Entry[]): Promise<boolean> {
    setBusy(true);
    setError("");
    try {
      const result = await saveProfileSection(section, next);
      if (result.error) {
        setError(result.error);
        return false;
      }
      onChange(next);
      return true;
    } catch {
      setError("Couldn't save. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || editing === null) return;
    const next =
      editing >= 0
        ? entries.map((e, i) => (i === editing ? draft : e))
        : [...entries, draft];
    if (await persist(next)) setEditing(null);
  }

  if (editing !== null) {
    return (
      <form className="complete__form" onSubmit={handleSubmit} aria-busy={busy}>
        {config.fields.map((f) => {
          const id = `${formId}-${f.name}`;
          const common = {
            id,
            name: f.name,
            required: f.required,
            placeholder: f.placeholder,
            maxLength: f.maxLength ?? 200,
            value: draft[f.name] ?? "",
            className: "field-control",
            onChange: (
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => setDraft((d) => ({ ...d, [f.name]: e.target.value })),
          };
          return (
            <FormField
              key={f.name}
              id={id}
              label={f.label}
              required={f.required}
            >
              {f.type === "textarea" ? (
                <textarea rows={3} {...common} />
              ) : (
                <input
                  type={f.type}
                  {...(f.type === "number" ? { min: 1950, max: 2100 } : {})}
                  {...common}
                />
              )}
            </FormField>
          );
        })}
        {error && (
          <p className="form-field__error" role="alert">
            {error}
          </p>
        )}
        <div className="profile-form__actions">
          <Button key="save" type="submit" variant="solid" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </Button>
          <Button
            key="cancel"
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setEditing(null)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="complete__entries">
      {entries.length === 0 && (
        <p className="profile-card__empty">Nothing added yet.</p>
      )}
      {entries.map((entry, i) => (
        <div key={i} className="complete__entry">
          <div className="complete__entry-text">
            <span className="complete__entry-title">
              {entry[config.primary]}
            </span>
            {entry[config.secondary] && (
              <span className="complete__entry-sub">
                {entry[config.secondary]}
              </span>
            )}
          </div>
          <div className="complete__entry-actions">
            <button
              type="button"
              className="complete__link"
              onClick={() => begin(i)}
            >
              Edit
            </button>
            <button
              type="button"
              className="complete__link complete__link--danger"
              disabled={busy}
              onClick={() => persist(entries.filter((_, j) => j !== i))}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      {entries.length < MAX_ENTRIES && (
        <div>
          <Button type="button" variant="outline" onClick={() => begin(-1)}>
            Add {config.itemLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

/* Resume / cover letter ---------------------------------------------------- */

function DocumentPanel({
  kind,
  file,
  onChange,
}: {
  kind: DocumentKind;
  file: { name: string } | null;
  onChange: (file: { name: string } | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = event.target.files?.[0];
    event.target.value = "";
    if (!chosen) return;
    if (chosen.size > MAX_DOCUMENT_BYTES) {
      setError("File is too large (4 MB maximum).");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.set("kind", kind);
      body.set("file", chosen);
      const result = await uploadProfileDocument(body);
      if (result.error) setError(result.error);
      else onChange({ name: chosen.name });
    } catch {
      setError("Couldn't upload the file. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleView() {
    setError("");
    const result = await profileDocumentUrl(kind);
    if (result.url) window.open(result.url, "_blank", "noopener");
    else setError(result.error ?? "Couldn't open the file.");
  }

  async function handleRemove() {
    setBusy(true);
    setError("");
    try {
      const result = await removeProfileDocument(kind);
      if (result.error) setError(result.error);
      else onChange(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="complete__entries">
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={DOCUMENT_EXTENSIONS.map((e) => `.${e}`).join(",")}
        onChange={handleFile}
      />
      {file ? (
        <div className="complete__entry">
          <div className="complete__entry-text">
            <span className="complete__entry-title">{file.name}</span>
          </div>
          <div className="complete__entry-actions">
            <button
              type="button"
              className="complete__link"
              onClick={handleView}
            >
              View
            </button>
            <button
              type="button"
              className="complete__link complete__link--danger"
              disabled={busy}
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <p className="profile-card__empty">No file uploaded.</p>
      )}
      {error && (
        <p className="form-field__error" role="alert">
          {error}
        </p>
      )}
      <div>
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : file ? "Replace file" : "Upload file"}
        </Button>
      </div>
      <p className="form-field__hint">PDF, DOC or DOCX, up to 4 MB.</p>
    </div>
  );
}
