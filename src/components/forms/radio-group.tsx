"use client";

import { Field, ErrorMessage } from "formik";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface RadioGroupFieldProps {
  id: string;
  name: string;
  label: string;
  options: Option[];
  className?: string;
  required?: boolean;
  description?: string;
}

export function RadioGroupField({
  id,
  name,
  label,
  options,
  className,
  required = false,
  description,
}: RadioGroupFieldProps) {
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
        {({ field, form }: any) => (
          <RadioGroup
            defaultValue={field.value}
            onValueChange={(value) => form.setFieldValue(name, value)}
            className="flex gap-4"
          >
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`${id}-${option.value}`}
                />
                <Label
                  htmlFor={`${id}-${option.value}`}
                  className="cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
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
