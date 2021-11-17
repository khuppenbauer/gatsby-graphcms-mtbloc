import React, { useEffect, useRef } from "react"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import { 
  addControls, 
  addTrack, 
  addSymbol, 
  addImageClick, 
  addSymbolClick, 
  addArea,
  addMapClick,
  addBookClick,
  addRegionClick,
} from "../../helpers/mapbox"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN

const Mapbox = data => {
  const { data: geoJson, url, minCoords, maxCoords, hasSubCollections } = data
  const geoJsonData = geoJson ? geoJson : url;
  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    if (map.current) return; // initialize map only once
    mapboxgl.accessToken = mapboxToken
    const bounds = new mapboxgl.LngLatBounds([minCoords.longitude, minCoords.latitude], [maxCoords.longitude, maxCoords.latitude]);
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      bounds,
      fitBoundsOptions: (bounds, { padding: 50 }),
    });
    addControls(map);
    map.current.on('load', () => {
      map.current.addSource('route', {
        type: 'geojson',
        data: geoJsonData,
      });
      addArea(map, 'book');
      addArea(map, 'map');
      addArea(map, 'regions');
      addMapClick(map);
      addBookClick(map);
      if (hasSubCollections) {
        addRegionClick(map);
      }
      addTrack(map);
    });
    addSymbol(map, 'image', 'attraction');
    addImageClick(map, 'image');
    addSymbol(map, 'pass', 'mountain');
    addSymbol(map, 'residence', 'town-hall');
    addSymbolClick(map, 'pass');
    addSymbolClick(map, 'residence');
  });

  return <div ref={mapContainer} style={{ height: "50vH", width: "100%" }} />;
}

export default Mapbox
