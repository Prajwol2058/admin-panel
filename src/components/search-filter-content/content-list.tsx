import type { Content } from "@/types/content-types";
import ContentGridView from "./content-grid-view";
import ContentListView from "./content-list-view";

interface ContentListProps {
  content: Content[];
  viewMode: string;
  handleViewContent: (id: number) => void;
  getCategoryName: (categoryId: number | string) => string;
}

export default function ContentList({
  content,
  viewMode,
  handleViewContent,
  getCategoryName,
}: ContentListProps) {
  return (
    <>
      {viewMode === "grid" ? (
        <ContentGridView
          content={content}
          handleViewContent={handleViewContent}
          getCategoryName={getCategoryName}
        />
      ) : (
        <ContentListView
          content={content}
          handleViewContent={handleViewContent}
          getCategoryName={getCategoryName}
        />
      )}
    </>
  );
}
