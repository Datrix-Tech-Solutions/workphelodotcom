"use client";

import { useRef } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import FormField from "@/components/molecules/FormField";
import type { Answers } from "@/lib/apply";
import type { JobQuestion } from "@/lib/jobs";

interface EmployerQuestionsFormProps {
  questions: JobQuestion[];
  defaultAnswers: Answers;
  onNext: (answers: Answers) => void;
  onBack: (answers: Answers) => void;
}

const optionsFor = (question: JobQuestion) =>
  question.type === "YES_NO" ? ["Yes", "No"] : question.options;

export default function EmployerQuestionsForm({
  questions,
  defaultAnswers,
  onNext,
  onBack,
}: EmployerQuestionsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const readAnswers = (): Answers => {
    const data = formRef.current ? new FormData(formRef.current) : null;
    const answers: Answers = {};
    for (const question of questions) {
      const given = (data?.getAll(`q-${question.id}`) ?? [])
        .map((value) => value.toString().trim())
        .filter(Boolean);
      if (given.length > 0) answers[question.id] = given;
    }
    return answers;
  };

  return (
    <form
      ref={formRef}
      className="apply-form"
      aria-labelledby="employer-questions-title"
      onSubmit={(e) => {
        e.preventDefault();
        onNext(readAnswers());
      }}
    >
      <h2 id="employer-questions-title" className="apply-form__title">
        Employer Questions
      </h2>

      {questions.length === 0 && (
        <p className="apply-form__note">
          This employer has no additional questions. Continue to review your
          application.
        </p>
      )}

      {questions.map((question) => {
        const id = `q-${question.id}`;
        const saved = defaultAnswers[question.id] ?? [];

        if (
          question.type === "CHECKBOXES" ||
          question.type === "YES_NO" ||
          question.type === "MULTIPLE_CHOICE"
        ) {
          const multiple = question.type === "CHECKBOXES";
          return (
            <fieldset key={question.id} className="form-field">
              <legend className="form-field__label">
                {question.question}
                {question.required && (
                  <span className="form-field__required" aria-hidden="true">
                    {" "}
                    *
                  </span>
                )}
              </legend>
              {optionsFor(question).map((option) => (
                <label key={option}>
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    name={id}
                    value={option}
                    defaultChecked={saved.includes(option)}
                    required={question.required && !multiple ? true : undefined}
                  />{" "}
                  {option}
                </label>
              ))}
            </fieldset>
          );
        }

        return (
          <FormField
            key={question.id}
            id={id}
            label={question.question}
            required={question.required}
          >
            {question.type === "DROPDOWN" ? (
              <Select
                id={id}
                name={id}
                required={question.required}
                defaultValue={saved[0] ?? ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                {question.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            ) : question.type === "PARAGRAPH" ? (
              <textarea
                id={id}
                name={id}
                rows={5}
                maxLength={4000}
                required={question.required}
                className="input field-control"
                defaultValue={saved[0]}
              />
            ) : (
              <Input
                id={id}
                name={id}
                maxLength={4000}
                required={question.required}
                className="field-control"
                defaultValue={saved[0]}
              />
            )}
          </FormField>
        );
      })}

      <div className="apply-form__actions">
        <Button
          variant="soft"
          type="button"
          onClick={() => onBack(readAnswers())}
        >
          Back
        </Button>
        <Button variant="solid">Continue</Button>
      </div>
    </form>
  );
}
