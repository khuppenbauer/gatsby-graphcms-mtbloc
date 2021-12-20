import React, { useReducer, createContext } from "react"
import update from 'immutability-helper';

import Mapbox from "./mapbox/track"
import Charts from "./charts"

export const TrackContext = createContext(null);

const initialState = {
  point: [],
  index: 0,
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case 'chart':
      return update(state, { point: {$set: data}});
    case 'map':
      return update(state, { index: {$set: data}});
    default:
      return initialState;
  }
};

const Map = ({ data, minCoords, maxCoords, distance, layers }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <TrackContext.Provider value={{ state, dispatch }}>
      <div className="mb-10 w-full">
        <Mapbox data={data} minCoords={minCoords} maxCoords={maxCoords} layers={layers} />
      </div>
      <div className="mb-10">
        <Charts data={data} distance={distance} />
      </div>
    </TrackContext.Provider>
  );
}

export default Map;
