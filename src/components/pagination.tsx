import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button onClick={handlePrevious} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span>
        Page {page} of {totalPages}
      </span>
      <Button onClick={handleNext} disabled={page === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
