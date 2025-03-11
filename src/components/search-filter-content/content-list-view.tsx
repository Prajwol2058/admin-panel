"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Content } from "@/types/content-types";
import { Calendar, File, FileText, User } from "lucide-react";
import { formatDate, truncateText } from "../utils/content-utils";

interface ContentListViewProps {
  content: Content[];
  handleViewContent: (id: number) => void;
  getCategoryName: (categoryId: number | string) => string;
}

export default function ContentListView({
  content,
  handleViewContent,
  getCategoryName,
}: ContentListViewProps) {
  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden hover:bg-accent/10 transition-colors"
        >
          <div className="flex flex-col sm:flex-row">
            {item?.photo && (
              <div className="w-full sm:w-48 h-48 overflow-hidden bg-gray-100">
                <img
                  src={
                    typeof item.photo === "string"
                      ? item.photo
                      : URL.createObjectURL(item.photo)
                  }
                  alt={item.title}
                  className="h-full w-full object-contain transition-all hover:scale-105 duration-300"
                />
              </div>
            )}
            <div className="flex flex-col flex-1 p-4">
              <div className="mb-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground my-2">
                <Badge variant="secondary" className="font-normal">
                  {typeof item.category.id === "number"
                    ? getCategoryName(item.category.name)
                    : item.category.name}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(item.created_at)}</span>
                </div>
                {item.author.id && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>ID: {item.author.id}</span>
                  </div>
                )}
                {item.size && (
                  <div className="flex items-center gap-1">
                    <File className="h-3 w-3" />
                    <span>{item.size} KB</span>
                  </div>
                )}
              </div>

              <p className="text-sm line-clamp-2 flex-grow">
                {truncateText(item.content, 180)}
              </p>

              <div className="mt-3 self-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewContent(item.id)}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Read More
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
