import { default as React } from "react"
import { createConnector } from 'react-instantsearch-dom';

const connect = createConnector({
  displayName: 'Radius',

  getProvidedProps(props, searchState) {
    const { aroundRadius, aroundLatLng } = searchState;
    const currentRefinement = {
      aroundRadius: aroundRadius || 5000,
      aroundLatLng,
    };
    return { currentRefinement };
  },

  refine(props, searchState, nextValue) {
    return {
    ...searchState,
    aroundRadius: nextValue,
    };
  },

  getSearchParameters(searchParameters, props, searchState) {
    const { aroundRadius } = searchState;
    return searchParameters.setQueryParameter('aroundRadius', aroundRadius || 5000);
  },

  cleanUp(props, searchState) {
    const { aroundRadius, ...nextValue } = searchState;
    return nextValue;
  },
});

const aroundRadius = connect((Radius) => {
  const { items, refine, createURL, currentRefinement } = Radius;
  const { aroundLatLng, aroundRadius } = currentRefinement;
  if (!aroundLatLng) {
    return null;
  }
  const { lat, lng } = aroundLatLng;
  if (!lat && !lng) {
    return null;
  }
  return (
    <div className="bg-gray-900 pb-5 md:py-3 flex flex-col">
      <nav
        className="rounded-md shadow-sm -space-x-px"
        aria-label="Sort"
      >
        {items.map(item => {
          const { value, label } = item;
          const active = aroundRadius === value ? "bg-gray-800" : "";
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
              {label}
            </a>
          )
        })}
      </nav>
    </div>      
  )
});

export default aroundRadius;
