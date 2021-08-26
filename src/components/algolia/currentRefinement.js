import { default as React } from "react"
import { connectCurrentRefinements } from 'react-instantsearch-dom';

const currentRefinements = connectCurrentRefinements((CurrentRefinements) => {
  const { items, refine, createURL } = CurrentRefinements;
  return (
    <>
      {items.length > 0 ? (
        <div className="my-2">
          {items.map((item) => {
            const { currentRefinement, value } = item;
            const label = currentRefinement.split('>').pop().trim();
            return (
              <span key={value} className="rounded-sm py-1 px-2 text-xs font-medium text-white bg-blue-500">
                <a
                  href={createURL(value)}
                  onClick={event => {
                    event.preventDefault();
                    refine(value);
                  }}
                >
                  {label}<span className="ml-2 text-base cursor-pointer">×</span>
                </a>
              </span>
            )
          })}
        </div>
        ) : null
      }
    </>
  )
});

export default currentRefinements;
