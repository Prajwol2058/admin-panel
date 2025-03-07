"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent } from "react";
import { Camera, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui";

interface PhotoUploadProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhotoUpload({ value, onChange, className }: PhotoUploadProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Maximum size is 5MB.");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        className="relative flex flex-col items-center justify-center"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/50 bg-muted transition-all hover:border-primary",
            value ? "border-solid" : "border-dashed"
          )}
        >
          {value ? (
            <img
              src={value || "/placeholder.svg"}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera className="h-10 w-10 text-muted-foreground" />
          )}

          {/* Hover overlay */}
          {isHovering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
              <Upload className="h-8 w-8" />
            </div>
          )}
        </div>

        {/* Remove button */}
        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
            onClick={handleRemovePhoto}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="mt-2 text-xs text-muted-foreground">
        Click to upload profile photo
      </p>
    </div>
  );
}
