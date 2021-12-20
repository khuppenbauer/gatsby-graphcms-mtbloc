import React, { useEffect, useRef } from "react"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import mapboxHelpers from "../../helpers/mapbox"
import { getTracks, getRegions } from "../../helpers/geoJson"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN

const addRegionSource = (map, geoJsonData) => {
  const regions = getRegions(geoJsonData);
  if (regions.length > 0) {
    map.addSource('regions', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: regions,
      },
    });
    mapboxHelpers.layer.addArea(map, 'regions', 'regions');
  }
}

const addTrackSource = (map, geoJsonData) => {
  const trackFeatures = getTracks(geoJsonData);
  trackFeatures.forEach((feature) => {
    const { properties, geometry } = feature;
    const id = `track-${properties.name}`;
    const index = Math.round(geometry.coordinates.length / 2);
    map.addSource(id, {
      type: 'geojson',
      data: feature,
      promoteId: 'name',
    });
    map.addSource(`${id}-border`, {
      type: 'geojson',
      data: feature,
      promoteId: 'name',
    });
    map.addSource(`${id}-point`, {
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
}

const Mapbox = data => {
  const { data: geoJson, url, minCoords, maxCoords, layers, subCollections } = data
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
      if (subCollections) {
        addRegionSource(map.current, geoJsonData);
      } else {
        addTrackSource(map.current, geoJsonData);
      }
      mapboxHelpers.layer.addLayers(map.current, geoJsonData, 'collection');
    });
    if (layers) {
      map.current.once('style.load', () => {
        mapboxHelpers.control.addControls(map.current, geoJsonData, minCoords, maxCoords, layers, 'collection');
      });
    }
  });

  return <div ref={mapContainer} style={{ height: "50vH", width: "100%" }} />;
}

export default Mapbox
