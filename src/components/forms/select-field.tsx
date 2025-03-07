"use client";

import { Field, ErrorMessage, FieldProps } from "formik";

import { cn } from "@/lib/utils";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  description?: string;
}

export function SelectField({
  id,
  name,
  label,
  options,
  placeholder = "Select an option",
  className,
  required = false,
  description,
}: SelectFieldProps) {
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

      <Field name={name}>
        {({ field, form, meta }: FieldProps) => (
          <Select
            defaultValue={field.value}
            onValueChange={(value) => form.setFieldValue(name, value)}
          >
            <SelectTrigger
              id={id}
              className={meta.touched && meta.error ? "border-destructive" : ""}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>

      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-destructive"
      />
    </div>
  );
}
