import type React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui";

interface FormSubmitProps {
  isSubmitting: boolean;
  label: string;
  submittingLabel?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function FormSubmit({
  isSubmitting,
  label,
  submittingLabel,
  className,
  icon,
}: FormSubmitProps) {
  return (
    <Button
      type="submit"
      className={cn("w-full", className)}
      disabled={isSubmitting}
    >
      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isSubmitting ? submittingLabel || `${label}ing...` : label}
      {!isSubmitting && icon}
    </Button>
  );
}
