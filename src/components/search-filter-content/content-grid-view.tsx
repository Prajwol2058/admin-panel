"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Content } from "@/types/content-types";
import { Calendar, FileText } from "lucide-react";
import { formatDate, truncateText } from "../utils/content-utils";

interface ContentGridViewProps {
  content: Content[];
  handleViewContent: (id: number) => void;
  getCategoryName: (categoryId: number | string) => string;
}

export default function ContentGridView({
  content,
  handleViewContent,
  getCategoryName,
}: ContentGridViewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {content.map((item) => (
        <Card
          key={item.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-md"
        >
          {item?.photo && (
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={
                  typeof item.photo === "string"
                    ? item.photo
                    : URL.createObjectURL(item.photo)
                }
                alt={item.title}
                className="h-full w-full object-fill transition-all hover:scale-105 duration-300"
              />
            </div>
          )}
          <CardHeader className="pb-2">
            <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {item.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
              <Badge variant="secondary" className="font-normal">
                {typeof item.category.id === "number"
                  ? getCategoryName(item.category.name)
                  : item.category.name}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(item.created_at)}</span>
              </div>
            </div>
            <p className="line-clamp-3 text-sm">
              {truncateText(item.content, 120)}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleViewContent(item.id)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Read More
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
