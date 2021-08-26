import { default as React } from "react"
import { connectSortBy } from 'react-instantsearch-dom';
import { 
  ChevronDown, ChevronUp,
} from "react-feather"

const sortBy = connectSortBy((SortBy) => {
  const { items, refine, createURL } = SortBy;
  return (
    <div className="bg-gray-900 pb-5 flex flex-col">
      <nav
        className="rounded-md shadow-sm -space-x-px"
        aria-label="Sort"
      >
        {items.map(item => {
          const { value, label, isRefined, dir } = item;
          let dirIcon = ( <ChevronDown className="h-5 w-5" /> );
          if (dir === 'asc') {
            dirIcon = ( <ChevronUp className="h-5 w-5" /> );
          }
          if (dir === 'desc') {
            dirIcon = ( <ChevronDown className="h-5 w-5" /> );
          }
          const active = isRefined ? "bg-gray-800" : "";
          return (
            <a
              key={value}
              className={`${active} relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800`}
              href={createURL(value)}
              onClick={event => {
                event.preventDefault();
                refine(value);
              }}
            >
              {dirIcon} {label}
            </a>
          )
        })}
      </nav>
    </div>      
  )
});

export default sortBy;
