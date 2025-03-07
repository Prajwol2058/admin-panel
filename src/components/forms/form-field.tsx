import type React from "react";
import { Field, ErrorMessage, FieldProps } from "formik";
import { cn } from "@/lib/utils";
import { Input, Label } from "../ui";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  children?: React.ReactNode;
}

export function FormField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  className,
  required = false,
  disabled = false,
  description,
  children,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={
            required
              ? "after:content-['*'] after:ml-0.5 after:text-destructive"
              : ""
          }
        >
          {label}
        </Label>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>

      {children || (
        <Field name={name}>
          {({ field, meta }: FieldProps) => (
            <Input
              id={id}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={meta.touched && meta.error ? "border-destructive" : ""}
              {...field}
            />
          )}
        </Field>
      )}

      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-destructive"
      />
    </div>
  );
}
