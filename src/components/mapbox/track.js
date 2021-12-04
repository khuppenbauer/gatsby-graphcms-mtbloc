import React, { useEffect, useRef, useContext } from "react"
import turf from "turf"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import mapboxHelpers from "../../helpers/mapbox"
import { getTracks } from "../../helpers/geoJson"

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
    map.current.on('style.load', () => {
      const trackFeatures = getTracks(geoJsonData);
      trackFeatures.forEach((feature) => {
        const { properties, geometry } = feature;
        const id = `track-${properties.name}`;
        const index = Math.round(geometry.coordinates.length / 2);
        map.current.addSource(id, {
          type: 'geojson',
          data: feature,
          promoteId: 'name',
        });
        map.current.addSource(`${id}-point`, {
          type: 'geojson',
          data: {
            type: "Feature",
            properties: feature.properties,
            geometry: {
              type: "Point",
              coordinates: geometry.coordinates[index],
            },
          },
          promoteId: 'name',
        });
      });
      map.current.addSource('features', {
        type: 'geojson',
        data: geoJsonData,
        promoteId: 'name',
      });
      mapboxHelpers.layer.addLayers(map.current, geoJsonData, 'track');
      mapboxHelpers.chart.addChartPoints(map.current);
    });
    map.current.once('style.load', () => {
      mapboxHelpers.control.addControls(map.current, geoJsonData);
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
