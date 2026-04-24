import PageButton from "@/app/components/button/PageButton";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}


export default function Pagination({ currentPage, totalPages, onNextPage, onPreviousPage }: PaginationProps) {

  return (
    <div className="flex justify-between items-center px-[4rem] pt-5">
      <div className="flex items-center space-x-2">
        <p>Page</p>
        <div style={{ borderRadius: '50%' }} className="w-10 h-10 border border-teritaryGrey flex items-center justify-center">
          {currentPage}
        </div>
        <p>{`of ${totalPages}`}</p>
      </div>

      <PageButton
        onNext={onNextPage}
        onPrev={onPreviousPage}
      />
    </div>
  );
}