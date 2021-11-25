import React, { useEffect, useRef, useContext } from "react"
import turf from "turf"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import StyleSelector from "./styleSelector"
import { 
  addControls, 
  addTrack, 
  addSymbol, 
  addImageClick, 
  addSymbolClick, 
  addArea,
  addMapClick,
  addBookClick,
  addChartPoints,
  addTrackPoint,
  addTrackPointClick,
} from "../../helpers/mapbox"
import { TrackContext } from "../mapChart"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN

const Mapbox = data => {
  const { state } = useContext(TrackContext);

  const { data: geoJson, url, minCoords, maxCoords } = data
  const geoJsonData = geoJson ? geoJson : url;

  const mapContainer = useRef(null)
  const map = useRef(null)

  useEffect(() => {
    const tracks = geoJsonData.features
      .filter((feature) => feature.geometry.type === 'LineString');
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
    map.current.addControl(
      new StyleSelector({
        styles: [
          'outdoors-v11',
          'satellite-streets-v11'
        ],
      }),
      'bottom-left'
    );
    map.current.on('style.load', () => {
      map.current.addSource('route', {
        type: 'geojson',
        data: geoJsonData,
      });
      addArea(map, 'book');
      addArea(map, 'map');
      addArea(map, 'regions');
      addTrack(map);
      addSymbol(map, 'pass', 'mountain');
      addSymbol(map, 'residence', 'town-hall');
      addSymbol(map, 'image', 'attraction');
      addChartPoints(map);
      if (tracks.length > 1) {
        addTrackPoint(map, 'trackPoint');
      }
    });
    addImageClick(map, 'image');
    addSymbolClick(map, 'pass');
    addSymbolClick(map, 'residence');
    addMapClick(map);
    addBookClick(map);
    if (tracks.length > 1) {
      addTrackPointClick(map);
    }
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    const { point } = state;
    if (point.length > 0) {
      map.current
        .getSource("chart-point-source")
        .setData(turf.point(point));
    }
  });

  return <div ref={mapContainer} style={{ height: "50vH", width: "100%" }} />;
}

export default Mapbox
