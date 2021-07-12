import React from "react"
import { Link } from "gatsby"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "react-feather"

const Tracks = ({ currentPage, numPages }) => {
  const previous = currentPage > 2 ? currentPage - 1 : ""
  const next = currentPage < numPages ? currentPage + 1 : numPages
  const paginationLength = 7
  let startPage = currentPage - 3
  if (currentPage < 4) {
    startPage = 1
  }
  if (currentPage > numPages - 4) {
    startPage = numPages - 6
  }
  return (
    <div className="bg-gray-900 px-4 py-3 flex flex-col items-center justify-between sm:px-6">
      <nav
        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <Link
          to="/tracks"
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronsLeft className="h-5 w-5" />
        </Link>
        <Link
          to={`/tracks/${previous}`}
          className="relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        {Array.from({ length: paginationLength }, (_, i) => {
          const j = startPage + i
          const active = j === currentPage ? "bg-gray-800" : ""
          return (
            <Link
              key={`pagination-number${j}`}
              to={`/tracks/${j < 2 ? "" : j}`}
              className={`${active} relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800`}
            >
              {j}
            </Link>
          )
        })}
        <Link
          to={`/tracks/${next}`}
          className="relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
        <Link
          to={`/tracks/${numPages}`}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        >
          <ChevronsRight className="h-5 w-5" />
        </Link>
      </nav>
    </div>
  )
}

export default Tracks
