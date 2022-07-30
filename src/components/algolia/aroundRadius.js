import { default as React } from "react"
import { useInstantSearch } from 'react-instantsearch-hooks';

const AroundRadius = (props) => {
  const { setIndexUiState, results } = useInstantSearch()
  if (!results) {
    return <></>;
  }
  const { _state } = results;
  const { aroundLatLng, aroundRadius } = _state;
  if ((!aroundLatLng || aroundLatLng === "")) {
    return <></>;
  }
  const { data } = props;
  if (!data) {
    return <></>;
  }
  return (
    <div className="bg-gray-900 pb-5 md:py-3 flex flex-col">
      <nav
        className="rounded-md shadow-sm -space-x-px"
        aria-label="Sort"
      >
        {data.map(item => {
          const { value, label } = item;
          const active = aroundRadius === value ? "bg-gray-800" : "";
          return (
            <button
              key={value}
              className={`${active} relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800`}
              onClick={event => {
                event.preventDefault();
                setIndexUiState((prevIndexUiState) => ({
                  ...prevIndexUiState,
                  configure: {
                    ...prevIndexUiState.configure,
                    aroundRadius: value,
                  }
                }));
              }}
            >
              {label}
            </button>
          )
        })}
      </nav>
    </div>
  );
}

export default AroundRadius;
