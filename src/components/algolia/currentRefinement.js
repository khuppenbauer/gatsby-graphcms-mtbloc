import { default as React } from "react"
import { useCurrentRefinements } from 'react-instantsearch-hooks-web';

const CurrentRefinements = (props) => {
  const { items, refine, createURL } = useCurrentRefinements(props);
  return (
    <>
      {items.length > 0 ? (
        <div className="my-2" key="current-refinement">
          {items.map((item) => {
            const { refinements, attribute: key } = item;
            const items = refinements.map((refinement) => {
              const { label, type } = refinement;
              if (type === 'hierarchical') {
                return label.split('>').pop().trim();
              }
              return null;
            })
            const text = items.join('');
            if (text.length === 0) {
              return null;
            }
            return (
              <>
                <span key={key} className="rounded-sm py-1 px-2 text-xs font-medium text-white bg-blue-500">
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
                <br />
              </>
            )
          })}
        </div>
        ) : null
      }
    </>
  )
};

export default CurrentRefinements;
