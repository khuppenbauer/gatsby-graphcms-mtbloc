import React, { useEffect, useRef, useContext } from "react"

import { MapContext } from "../algolia/map"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import mapboxHelpers from "../../helpers/mapbox"
import { getTracks, getTrackPoints, getRegions } from "../../helpers/geoJson"
import { colorbrewer } from "../../config/colorbrewer"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN

const addTrackSource = (map, geoJsonData, colorScheme) => {
  const trackFeatures = getTracks(geoJsonData);
  const tracksCount = trackFeatures.length;
  const colors = [];
  const colorSchemes = colorScheme.map((colorSchemeItem) => {
    return colorbrewer[colorSchemeItem];
  });
  colorScheme.forEach((colorSchemeItem, index) => {
    const colorBrewerScheme = colorbrewer[colorSchemeItem];
    Object.values(colorBrewerScheme).forEach((item) => {
      if (index > 0) {
        let i = 0;
        let arr = [];
        while (i < index) {
          const schemeIndex = Object.keys(colorSchemes[i]).length;
          arr = arr.concat(colorSchemes[i][schemeIndex]);
          i++;
        }
        colors.push([...new Set([...arr,...item])]);
      } else {
        colors.push(item);
      }
    });
  });
  trackFeatures.forEach((feature, index) => {
    const { properties, geometry } = feature;
    feature.properties.color = colors[tracksCount][index];
    const id = `track-${properties.name}`;
    const center = Math.round(geometry.coordinates.length / 2);
    if (!map.getSource(id)) {
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
            coordinates: geometry.coordinates[center],
          },
        },
        promoteId: 'name',
      });
    }
  });
}

const addClusterSource = (map, geoJsonData) => {
  const trackPoints = getTrackPoints(geoJsonData);
  map.addSource('cluster', {
    type: 'geojson',
    data: trackPoints,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });
}

const Mapbox = (data) => {
  const { dispatch } = useContext(MapContext);
  const { data: geoJson, url, minCoords, maxCoords, layers, colorScheme, tracksCount, trackSorting } = data
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
      fitBoundsOptions: (bounds),
    });

    let mapSource = 'track';
    map.current.on('style.load', () => {
      if (tracksCount > 10) {
        mapSource = 'cluster';
      }
      addTrackSource(map.current, geoJsonData, colorScheme);
      addClusterSource(map.current, geoJsonData);
      mapboxHelpers.layer.addCluster(map.current, mapSource);
      mapboxHelpers.layer.addLayers(map.current, geoJsonData, 'collection', mapSource);
    });
    map.current.once('style.load', () => {
      mapboxHelpers.control.addControls(map.current, geoJsonData, minCoords, maxCoords, layers, 'collection', mapSource, trackSorting);
    });
  }, [minCoords, maxCoords, geoJsonData, dispatch]);

  // Update bounds to match incoming bounds
  useEffect(() => {
    if (!(map.current && map.current.isStyleLoaded())) return
    const bounds = new mapboxgl.LngLatBounds([minCoords.longitude, minCoords.latitude], [maxCoords.longitude, maxCoords.latitude]);
    let mapSource = 'track';
    if (tracksCount > 10) {
      mapSource = 'cluster';
    } 
    addTrackSource(map.current, geoJsonData, colorScheme);
    map.current.getSource('cluster').setData(getTrackPoints(geoJsonData));
    mapboxHelpers.layer.addLayers(map.current, geoJsonData, 'collection', mapSource);
    map.current.fitBounds(bounds, { padding: 50 });
  }, [minCoords, maxCoords, geoJsonData]);

  return <div ref={mapContainer} style={{ height: "50vH", width: "100%" }} />;
}

export default Mapbox
