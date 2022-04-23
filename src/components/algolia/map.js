import React, { useState, useReducer, createContext } from 'react';
import update from 'immutability-helper'
import { Switch } from '@headlessui/react'
import { connectGeoSearch, ClearRefinements } from 'react-instantsearch-dom';
import { getBounds } from 'geolib';

import Mapbox from '../mapbox/search'

export const MapContext = createContext(null);

const initialState = {
  bounds: null,
  loaded: false,
};

const reducer = (state, action) => {
  console.log(['reducer', initialState, state, action]);
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
      name, _geoloc,
    } = hit;
    const coordinates = _geoloc.map((coordinate) => {
      const { lat, lng } = coordinate;
      return [lng, lat];
    })
    features.push({
      type: 'Feature',
      properties: {
        name
      },
      /* geometry: {
        type: 'LineString',
        coordinates,
      } */
      geometry: {
        type: 'Point',
        coordinates: [_geoloc[0].lng, _geoloc[0].lat],
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

const Search = ({dispatch, state, refine}) => {
  const { bounds } = state;
  return (
    <button
      key={`mapsearch-search`}
      onClick={() => {
        if (bounds) {
          // setUpdateMap(true);
          refine({
            northEast: bounds.getNorthEast(),
            southWest: bounds.getSouthWest(),
          });
        }
      }}
    >
      Suche
    </button>
  );
}

const map = connectGeoSearch((Hits) => {
  const { hits, refine } = Hits;
  if (hits.length === 0) {
    return null
  }
  const [enabled, setEnabled] = useState(false);
  const [updatedMap, setUpdateMap] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { bounds, loaded } = state;
  const { geoJson, minCoords, maxCoords } = parseHits(hits);
  const layers = ["track", "image"];
  console.log(['init', state, hits]);
  return (
    <div className="mb-10 w-full">
      <Switch.Group>
        <div className="flex items-center">
          <Switch.Label className="mr-4">Enable notifications</Switch.Label>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={`${
              enabled ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
          </Switch>
        </div>
      </Switch.Group>
      <MapContext.Provider value={{ state, dispatch }}>
        <div className="mb-10">
          <ClearRefinements />
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
            enabled={enabled}
            updatedMap={updatedMap}
            loaded={loaded}
          />
        </div>
      </MapContext.Provider>
    </div>
  );
});

export default map;
