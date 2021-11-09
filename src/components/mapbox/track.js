import React, { useEffect, useRef, useContext } from "react"
import turf from "turf"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

import { TrackContext } from "../mapChart"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN
const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const Mapbox = data => {
  const { state } = useContext(TrackContext);

  const { data: geoJson, url, minCoords, maxCoords } = data
  const geoJsonData = geoJson ? geoJson : url;

  const mapContainer = useRef(null)
  const map = useRef(null)

  const addControls = () => {
    if (map.current) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }));
    }
  };

  const addTrack = () => {
    if (map.current) {
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': [
            'get', 'color',
          ],
          'line-width': 2,
        },
        filter: ['==', '$type', 'LineString'],
      })
    }
  }

  const addImages = () => {
    if (map.current) {
      map.current.on('load', () => {
        map.current.addLayer({
          id: 'image',
          type: 'symbol',
          source: 'route',
          layout: {
            'icon-image': 'attraction-15',
            'icon-allow-overlap': true,
          },
          filter: ['==', '$type', 'Point'],
        });
      });

      map.current.on('click', 'image', (e) => {
        const { properties } = e.features[0];
        const { handle, orientation } = properties;
        const width = orientation === 'landscape' ? 320 : 240;
        const height = orientation === 'landscape' ? 240 : 320; 
        const src = `${assetBaseUrl}/resize=w:${width},h:${height},fit:crop/auto_image/compress/${handle}`;
        const html = `<img src="${src}" width="${width}" height="${height}" />`;
        if (html) {
          new mapboxgl.Popup({ anchor: 'center' })
            .setLngLat(map.current.getCenter())
            .setHTML(html)
            .addTo(map.current);
        }
      });
  
      map.current.on('mouseenter', 'image', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });
  
      map.current.on('mouseleave', () => {
        map.current.getCanvas().style.cursor = '';
      });
    }
  }

  const addChartPoints = () => {
    if (map.current) {
      map.current.addSource("chart-point-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: []
        }
      });
      map.current.addLayer({
        id: "chart-point",
        type: "circle",
        source: "chart-point-source",
        paint: {
          "circle-color": "blue",
          "circle-stroke-color": "rgba(255,255,255,0.6)",
          "circle-stroke-width": 4,
          "circle-radius": 6,
          "circle-blur": 0.1
        }
      });
    }
  }

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
    addControls();
    map.current.on('load', () => {
      map.current.addSource('route', {
        type: 'geojson',
        data: geoJsonData,
      });
      addTrack();
      addChartPoints();
    });
    addImages();
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
