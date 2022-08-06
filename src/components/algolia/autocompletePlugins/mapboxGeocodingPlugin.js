import { default as React } from "react"
import qs from 'qs';

function debouncePromise(
  fn,
  time
) {
  let timerId = undefined;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise((resolve) => {
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

const debouncedFetch = debouncePromise(fetch, 300);

const createMapboxGeocodingPlugin = (
  options,
  onClick,
) => {
  return {
    getSources({ query }) {
      const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`;
      const queryParameters = qs.stringify({ ...options });
      const endpoint = [mapboxUrl, queryParameters].join('?');

      return debouncedFetch(endpoint)
        .then((response) => response.json())
        .then((data) => {
          if (!query) {
            return [
              {
                sourceId: 'mapboxPlugin',
                getItems() {
                  return [];
                },
                templates: {
                  item() {
                    return (
                      <></>
                    );
                  },
                },
              },              
            ];
          }
          return [
            {
              sourceId: 'mapboxPlugin',
              getItems() {
                return data.features;
              },
              templates: {
                header() {
                  return (
                    <React.Fragment>
                      <span className="aa-SourceHeaderTitle">Orte</span>
                      <div className="aa-SourceHeaderLine" />
                    </React.Fragment>
                  );
                },
                item({ item }) {
                  return (
                    <div>
                      <button onClick={() => onClick(item)}>
                        {item.place_name}
                      </button>
                    </div>
                  );
                },
              },
            },
          ];
        });
    },
  };
};

export { createMapboxGeocodingPlugin };
