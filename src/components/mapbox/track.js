import React, { useEffect, useRef, useContext } from "react"
import turf from "turf"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import mapboxHelpers from "../../helpers/mapbox" 

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
    if (map.current) return; // initialize map only once
    mapboxgl.accessToken = mapboxToken
    const bounds = new mapboxgl.LngLatBounds([minCoords.longitude, minCoords.latitude], [maxCoords.longitude, maxCoords.latitude]);
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      bounds,
      fitBoundsOptions: (bounds, { padding: 50 }),
    });
    mapboxHelpers.control.addControls(map);
    map.current.on('style.load', () => {
      const trackFeatures = geoJsonData.features
        .filter((feature) => feature.geometry.type === 'LineString');
      trackFeatures.forEach((feature) => {
        const id = `track-${feature.properties.name}`;
        map.current.addSource(id, {
          type: 'geojson',
          data: feature,
          promoteId: 'id',
        });
        mapboxHelpers.layer.addTrack(map, id, 'track');
      });
      map.current.addSource('features', {
        type: 'geojson',
        data: geoJsonData,
        promoteId: 'id',
      });
      mapboxHelpers.layer.addLayers(map, geoJsonData, 'track');
      mapboxHelpers.chart.addChartPoints(map);
    });
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
