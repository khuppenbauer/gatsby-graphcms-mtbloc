import { default as React } from "react"
import { useSortBy } from 'react-instantsearch-hooks-web';
import { 
  ChevronDown, ChevronUp,
} from "react-feather"

const SortBy = (props) => {
  const {
    currentRefinement,
    options,
    refine,
  } = useSortBy(props);
  return (
    <div className="bg-gray-900 pb-5 flex flex-col">
      <nav
        className="rounded-md shadow-sm -space-x-px"
        aria-label="Sort"
      >
        {options.map(item => {
          const { value, label, dir } = item;
          let dirIcon = ( <ChevronDown className="h-5 w-5" /> );
          if (dir === 'asc') {
            dirIcon = ( <ChevronUp className="h-5 w-5" /> );
          }
          if (dir === 'desc') {
            dirIcon = ( <ChevronDown className="h-5 w-5" /> );
          }
          const active = currentRefinement === value ? "bg-gray-800" : "";
          return (
            <button
              key={value}
              className={`${active} relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800`}
              onClick={event => {
                event.preventDefault();
                refine(value);
              }}
            >
              {dirIcon} {label}
            </button>
          )
        })}
      </nav>
    </div>      
  )
};

export default SortBy;
