import React, { useEffect, useRef } from "react"
import slugify from "@sindresorhus/slugify";

import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

const mapboxToken = process.env.GATSBY_MAPBOX_ACCESS_TOKEN

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
    let clickedTrackId = null;
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.on('load', () => {
      // add sources
      map.addSource('route', {
        type: 'geojson',
        data: geoJsonData,
        promoteId: 'id',
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
          'line-color': [
            'get', 'color',
          ],
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            5,
            3
          ],
        },
      })
        // When the user clicks we'll update the
        // feature state for the feature under the mouse.
        map.on('click', 'route', function(e) {
          if (e.features.length > 0) {
            const { properties } = e.features[0];
            const { name, type } = properties;
            let url;
            if (type === 'track') {
              url = `/tracks/${slugify(name)}`;
            } else {
              url = `/regions/${slugify(name)}`;
            }
            const html = `<a href="${url}">${name}</a>`;
            if (html) {
              new mapboxgl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(html)
                .addTo(map);
            }
            if (clickedTrackId) {
              map.setFeatureState(
                { source: 'route', id: clickedTrackId },
                { click: false }
              );
            }
            clickedTrackId = properties.id;
            map.setFeatureState(
              { source: 'route', id: clickedTrackId },
              { click: true }
            );
          }
        });
        map.on('mouseenter', 'route', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
  
        map.on('mouseleave', 'route', () => {
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
