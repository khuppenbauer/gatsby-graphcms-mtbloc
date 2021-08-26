import { default as React } from "react"
import { connectPagination } from 'react-instantsearch-dom';
import { 
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from "react-feather"

const pagination = connectPagination((Pagination) => {
  const { currentRefinement: currentPage, nbPages: numPages, refine, createURL } = Pagination;
  const previous = currentPage > 2 ? currentPage - 1 : ""
  const next = currentPage < numPages ? currentPage + 1 : numPages
  let paginationLength = 7
  let startPage = currentPage - 3
  if (currentPage < 4) {
    startPage = 1
  }
  if (currentPage > numPages - 4) {
    startPage = numPages - 6
  }
  startPage = startPage < 1 ? 1 : startPage;
  paginationLength = paginationLength > numPages ? numPages : paginationLength;
  return (
    <div className="bg-gray-900 px-4 py-3 flex flex-col items-center justify-between sm:px-6">
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <a
          key={`pagination-first-1`}
          href={createURL(1)}
          onClick={event => {
            event.preventDefault();
            refine(1);
          }}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronsLeft className="h-5 w-5" />
        </a>
        <a
          key={`pagination-previous-${previous}`}
          href={createURL(previous)}
          onClick={event => {
            event.preventDefault();
            refine(previous);
          }}
          className="relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </a>
        {Array.from({ length: paginationLength }, (_, i) => {
          const j = startPage + i
          const active = j === currentPage ? "bg-gray-800" : ""
          return (
            <a
              key={`pagination-number${j}`}
              href={createURL(j)}
              className={`${active} relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800`}
              onClick={event => {
                event.preventDefault();
                refine(j);
              }}
            >
              {j}
            </a>
          )
        })}
        <a
          key={`pagination-next-${next}`}
          href={createURL(next)}
          onClick={event => {
            event.preventDefault();
            refine(next);
          }}
          className="relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronRight className="h-5 w-5" />
        </a>
        <a
          key={`pagination-last-${numPages}`}
          href={createURL(numPages)}
          onClick={event => {
            event.preventDefault();
            refine(numPages);
          }}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronsRight className="h-5 w-5" />
        </a>
      </nav>
    </div>
  )
});

export default pagination;
