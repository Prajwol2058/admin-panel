"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Content } from "@/types/content-types";
import {
  ArrowLeft,
  Calendar,
  File,
  Maximize2,
  Share2,
  User,
} from "lucide-react";
import { formatDate } from "../utils/content-utils";

interface ContentDetailViewProps {
  content: Content;
  onBack: () => void;
  getCategoryName: (categoryId: number | string) => string;
}

export default function ContentDetailView({
  content,
  onBack,
  getCategoryName,
}: ContentDetailViewProps) {
  if (!content) return null;

  return (
    <div className="space-y-6">
      {/* Back button and metadata bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="self-start">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Title and subtitle */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold mb-3">{content.title}</h1>
          <p className="text-xl text-muted-foreground">{content.subtitle}</p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
            <Badge variant="secondary" className="font-normal">
              {typeof content.category.id === "number"
                ? getCategoryName(content.category.name)
                : content.category.name}
            </Badge>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(content.created_at)}</span>
            </div>

            {content.author.id && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  Author ID:{content.author.name} ({content.author.id})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feature image */}
        {content.photo && (
          <div className="max-h-96 overflow-hidden rounded-lg border shadow-sm">
            <img
              src={
                typeof content.photo === "string"
                  ? content.photo
                  : URL.createObjectURL(content.photo)
              }
              alt={content.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Main article content */}
        <article className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed">
            {content.content}
          </div>
        </article>

        {/* Additional metadata */}
        <div className="bg-muted/20 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-medium mb-3">Content Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.width && content.height && (
              <div className="flex items-center gap-2 text-sm">
                <Maximize2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="font-medium">Dimensions: </span>
                  <span>
                    {`${content.width}`.split(".")[0]}x
                    {`${content.height}`.split(".")[0]}
                  </span>
                </div>
              </div>
            )}

            {content.size && (
              <div className="flex items-center gap-2 text-sm">
                <File className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="font-medium">Size: </span>
                  <span>{content.size} KB</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Content List
          </Button>
        </div>
      </div>
    </div>
  );
}
