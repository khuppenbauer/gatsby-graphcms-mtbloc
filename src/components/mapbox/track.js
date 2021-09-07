import React, { useEffect, useRef } from "react"

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN
const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const Mapbox = data => {
  const { data: geoJson, url, minCoords, maxCoords } = data
  const geoJsonData = geoJson ? geoJson : url;
  // this ref holds the map DOM node so that we can pass it into Mapbox GL
  const mapNode = useRef(null)

  // this ref holds the map object once we have instantiated it, so that we
  // can use it in other hooks
  const mapRef = useRef(null)
  // construct the map within an effect that has no dependencies
  // this allows us to construct it only once at the time the
  // component is constructed.
  useEffect(() => {
    // Token must be set before constructing map
    mapboxgl.accessToken = mapboxToken
    const bounds = new mapboxgl.LngLatBounds([minCoords.longitude, minCoords.latitude], [maxCoords.longitude, maxCoords.latitude]);
    const map = new mapboxgl.Map({
      container: mapNode.current,
      style: 'mapbox://styles/mapbox/outdoors-v11',
      bounds,
      fitBoundsOptions: (bounds, { padding: 20 }),
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));

    map.on('load', () => {
      // add sources
      map.addSource('route', {
        type: 'geojson',
        data: geoJsonData,
      })
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': 'red',
          'line-width': 2,
        },
        filter: ['==', '$type', 'LineString'],
      })
      map.addLayer({
        id: 'image',
        type: 'symbol',
        source: 'route',
        layout: {
          'icon-image': 'attraction-15',
          'icon-allow-overlap': true,
        },
        filter: ['==', '$type', 'Point'],
      });
      map.on('click', 'image', (e) => {
        const { properties } = e.features[0];
        const { handle, orientation } = properties;
        const width = orientation === 'landscape' ? 320 : 240;
        const height = orientation === 'landscape' ? 240 : 320; 
        const src = `${assetBaseUrl}/resize=w:${width},h:${height},fit:crop/auto_image/compress/${handle}`;
        const html = `<img src="${src}" width="${width}" height="${height}" />`;
        if (html) {
          new mapboxgl.Popup({ anchor: 'center' })
            .setLngLat(map.getCenter())
            .setHTML(html)
            .addTo(map);
        }
      });
      map.on('mouseenter', 'image', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'image', () => {
        map.getCanvas().style.cursor = '';
      });
    })

    // hook up map events here, such as click, mouseenter, mouseleave
    // e.g., map.on('click', (e) => {})

    // when this component is destroyed, remove the map
    return () => {
      map.remove()
    }
  }, [geoJsonData, minCoords, maxCoords])

  // You can use other `useEffect` hooks to update the state of the map
  // based on incoming props.  Just beware that you might need to add additional
  // refs to share objects or state between hooks.
  return <div ref={mapNode} style={{ height: "50vH", width: "100%" }} />;
}

export default Mapbox
