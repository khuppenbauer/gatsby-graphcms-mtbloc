import { default as React } from "react"
import { useCurrentRefinements } from 'react-instantsearch-hooks-web';

const CurrentRefinements = (props) => {
  const { items, refine, createURL } = useCurrentRefinements(props);
  return (
    <>
      {items.length > 0 ? (
        <div className="my-2">
          {items.map((item) => {
            const { refinements } = item;
            const { value, label } = refinements[0];
            const text = label.split('>').pop().trim();
            return (
              <span key={value} className="rounded-sm py-1 px-2 text-xs font-medium text-white bg-blue-500">
                <a
                  href={createURL(refinements)}
                  onClick={event => {
                    event.preventDefault();
                    refine(refinements[0]);
                  }}
                >
                  {text}<span className="ml-2 text-base cursor-pointer">×</span>
                </a>
              </span>
            )
          })}
        </div>
        ) : null
      }
    </>
  )
};

export default CurrentRefinements;
