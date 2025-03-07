"use client";

import { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
}

export function PasswordField({
  id,
  name,
  label,
  placeholder,
  className,
  required = false,
  disabled = false,
  description,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

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

      <div className="relative">
        <Field name={name}>
          {({ field, meta }: any) => (
            <Input
              id={id}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              disabled={disabled}
              className={meta.touched && meta.error ? "border-destructive" : ""}
              {...field}
            />
          )}
        </Field>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      <ErrorMessage
        name={name}
        component="div"
        className="text-sm text-destructive"
      />
    </div>
  );
}
