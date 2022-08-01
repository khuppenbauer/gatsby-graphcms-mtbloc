import React, { useReducer, createContext } from 'react';
import update from 'immutability-helper'
import { useConnector } from 'react-instantsearch-hooks-web';
import { useInstantSearch } from 'react-instantsearch-hooks';

import connectGeoSearch from 'instantsearch.js/es/connectors/geo-search/connectGeoSearch';
import { getBounds } from 'geolib';

import Mapbox from '../mapbox/search'

export const MapContext = createContext(null);

const initialState = {
  bounds: null,
  loaded: false,
};

const useGeoSearch = (props) => {
  return useConnector(connectGeoSearch, props);
}

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case 'map':
      return update(state, {$set: data});
    default:
      return initialState;
  }
};

const parseHits = (hits) => {
  const features = [];
  const coords = [];
  hits.forEach((hit) => {
    const { 
      name, _geoloc, title, slug, distance, totalElevationGain, totalElevationLoss,
    } = hit;
    const coordinates = _geoloc.map((coordinate) => {
      const { lat, lng } = coordinate;
      return [lng, lat];
    })
    features.push({
      type: 'Feature',
      properties: {
        name,
        title,
        slug,
        distance,
        totalElevationGain,
        totalElevationLoss,
      },
      geometry: {
        type: 'LineString',
        coordinates,
      }
    });
    const bounds = getBounds(coordinates);
    coords.push([bounds.minLng, bounds.minLat]);
    coords.push([bounds.maxLng, bounds.maxLat]);
  });
  const geoJsonBounds = getBounds(coords);
  const { minLat, minLng, maxLat, maxLng } = geoJsonBounds;
  return {
    geoJson: {
      type: 'FeatureCollection',
      features,
    },
    minCoords: {
      latitude: minLat,
      longitude: minLng,
    },
    maxCoords: {
      latitude: maxLat,
      longitude: maxLng,
    },
  }
};

const Search = () => {
  const { setIndexUiState, results } = useInstantSearch();
  const { nbHits, hits } = results;
  if (hits.length >= nbHits) {
    return (
      <button
        className="bg-gray-800 border relative inline-flex items-center px-2 py-2 border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
        key={`mapsearch-search`}
      >
        {hits.length} Touren
      </button>
    );
  }
  return (
    <button
      className="border relative inline-flex items-center px-2 py-2 border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800"
      key={`mapsearch-search`}
      onClick={() => {
        setIndexUiState((prevIndexUiState) => ({
          ...prevIndexUiState,
          configure: {
            ...prevIndexUiState.configure,
            hitsPerPage: nbHits,
          }
        }));
      }}
    >
      Zeige alle {nbHits} Touren
    </button>
  );
}

const Map = (props) => {
  let { items: hits, refine } = useGeoSearch(props);
  const [state, dispatch] = useReducer(reducer, initialState);
  if (hits.length === 0) {
    return null
  }
  const { geoJson, minCoords, maxCoords } = parseHits(hits);
  const layers = ["track", "image"];
  const colorScheme = ["Spectral_10", "PRGn_10", "BrBG_10"]

  return (
    <div className="mb-10 w-full">
      <MapContext.Provider value={{ state, dispatch }}>
        <div className="mb-10">
          <Search 
            dispatch={dispatch}
            state={state}
            refine={refine}
          />
        </div>
        <div className="mb-10 w-full">
          <Mapbox
            id="mapsearch-map"
            data={geoJson}
            minCoords={minCoords}
            maxCoords={maxCoords}
            layers={layers}
            tracksCount={hits.length}
            trackSorting="title"
            colorScheme={colorScheme}
            width="100%"
            height="50vH"
          />
        </div>
      </MapContext.Provider>
    </div>
  );
};

export default Map;
