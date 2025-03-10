"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface PhotoUploadProps {
  initialValue?: string;
  onChange: (file: File | null) => void;
  name: string;
  error?: string;
  touched?: boolean;
}

export const UploadPhoto = ({
  initialValue,
  onChange,
  name,
  error,
  touched,
}: PhotoUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValue) {
      setPreview(initialValue);
    }
  }, [initialValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    onChange(selectedFile);

    // Create a preview URL for the selected file
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Clean up the object URL when component unmounts or when file changes
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>Photo</Label>
      <div
        className={`border-2 border-dashed rounded-md p-4 ${
          error && touched ? "border-destructive" : "border-muted-foreground/25"
        }`}
      >
        {preview ? (
          <div className="relative">
            <div className="relative h-48 w-full overflow-hidden rounded-md">
              <Image
                src={preview || "/placeholder.svg"}
                alt="Content preview"
                fill
                className="object-cover"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-4 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Click to upload an image or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG or WEBP (max. 5MB)
            </p>
          </div>
        )}
        <input
          type="file"
          id={name}
          name={name}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </div>
      {error && touched && (
        <div className="text-sm text-destructive">{error}</div>
      )}
    </div>
  );
};
