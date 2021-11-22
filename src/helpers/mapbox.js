import React from "react"
import mapboxgl from "mapbox-gl"
import slugify from "@sindresorhus/slugify"
import { renderToString } from 'react-dom/server';

import { renderMetaData } from "./track" 

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

export const addControls = (map) => {
  if (map.current) {
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    }));
    map.current.addControl(new mapboxgl.FullscreenControl())
  }
};

export const addArea = (map, type) => {
  if (map.current) {
    map.current.addLayer({
      id: `${type}-fill`,
      type: 'fill',
      source: 'route',
      paint: {
        'fill-color': [
          'get', 'color',
        ],
        'fill-opacity': 0.07,
      },
      filter: ['==', '$type', 'Polygon'],
    });
      
    map.current.addLayer({
      id: `${type}-outline`,
      type: 'line',
      source: 'route',
      paint: {
        'line-color': [
          'get', 'color',
        ],  
        'line-width': 1,
      },
      filter: ['==', '$type', 'Polygon'],
    });

    map.current.on('mouseenter', `${type}-fill`, () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', `${type}-fill`, () => {
      map.current.getCanvas().style.cursor = '';
    });
  }
}

export const addSymbol = (map, type, symbol) => {
  if (map.current) {
    map.current.on('load', () => {
      map.current.addLayer({
        id: type,
        type: 'symbol',
        source: 'route',
        layout: {
          'icon-image': `${symbol}-15`,
          'icon-allow-overlap': true,
        },
        filter: ['==', 'type', type],
      });
    });

    map.current.on('mouseenter', type, () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', type, () => {
      map.current.getCanvas().style.cursor = '';
    });
  }
}

export const addTrack = (map) => {
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
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'click'], false],
          3,
          2
        ],
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'click'], false],
          'red',
          ['get', 'color']
        ],
      },
      filter: ['==', 'type', 'track'],
    })
  }
}

export const addTrackPoint = (map, type) => {
  if (map.current) {
    map.current.on('load', () => {
      map.current.addLayer({
        id: `${type}-circle`,
        type: 'circle',
        source: 'route',
        paint: {
          'circle-color': '#fff',
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': [
            'get', 'color',
          ],
        },
        filter: ['==', 'type', type],
      });
      map.current.addLayer({
        id: type,
        type: 'symbol',
        source: 'route',
        layout: {
          'icon-image': 'bicycle-15',
          'icon-allow-overlap': true,
        },
        filter: ['==', 'type', type],
      });
    });

    map.current.on('mouseenter', type, () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', type, () => {
      map.current.getCanvas().style.cursor = '';
    });
  }
}

export const addBookClick = (map) => {
  if (map.current) {
    map.current.on('click', 'book-fill', (e) => {
      const { properties } = e.features[0];
      const {
        title,
        url,
      } = properties;
      const html = `<a href="${url}" target="_blank">${title}</a>`;
      if (title) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map.current);
      }
    });
  }
}

export const addImageClick = (map, type) => {
  if (map.current) {
    map.current.on('click', type, (e) => {
      const { properties } = e.features[0];
      const { handle, orientation, url, imageWidth, imageHeight } = properties;
      let width = imageWidth;
      let height = imageHeight;
      if (orientation) {
        width = orientation === 'landscape' ? 320 : 240;
        height = orientation === 'landscape' ? 240 : 320; 
      }
      let src = url;
      if (handle) {
        src = `${assetBaseUrl}/resize=w:${width},h:${height},fit:crop/auto_image/compress/${handle}`;
      }
      const html = `<img src="${src}" width="${width}" height="${height}" />`;
      if (html) {
        new mapboxgl.Popup({ anchor: 'center' })
          .setLngLat(map.current.getCenter())
          .setHTML(html)
          .addTo(map.current);
      }
    });
  }
}

export const addMapClick = (map) => {
  if (map.current) {
    map.current.on('click', 'map-fill', (e) => {
      const { properties } = e.features[0];
      const {
        article,
        name,
        scale,
        url,
      } = properties;
      const html = `<a href="${url}" target="_blank">${article}<br />${name}<br />1:${scale}</a>`;
      if (article) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map.current);
      }
    });
  }
}

export const addRegionClick = (map) => {
  if (map.current) {
    map.current.on('click', 'regions-fill', (e) => {
      const { properties } = e.features[0];
      const { name } = properties;
      const url = `/regions/${slugify(name)}`;
      const html = `<a href="${url}">${name}</a>`;
      if (html) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map.current);
      }
    });
  }
}

export const addSymbolClick = (map, type) => {
  if (map.current) {
    map.current.on('click', type, (e) => {
      const { properties } = e.features[0];
      const {
        name,
        desc,
        cmt,
        coordinates: coord,
      } = properties;
      let html = name;
      if (coord && coord[2]) {
        html = `${html} (${JSON.parse(coord)[2]} m)`;
      }
      if (desc && cmt) {
        html = `${html}<br />${desc}<br />${cmt.replace(/\r\n/g, '<br />')}`;
      }

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map.current);
    });
  }
}

export const addTrackPointClick = (map) => {
  if (map.current) {
    let clickedTrackId = null;
    map.current.on('click', 'trackPoint', (e) => {
      const { properties } = e.features[0];
      const { name } = properties;
      const text = (
        <>
          <div>
            <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
              {name}
            </span>
          </div>
          <div className="flex items-center flex-col">
            {renderMetaData(properties)}
          </div>
        </>
      );
      const url = `/tracks/${slugify(name)}`;
      const html = `<a href="${url}">${renderToString(text)}</a>`;
      if (html) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map.current);
      }
      if (clickedTrackId) {
        map.current.setFeatureState(
          { source: 'route', id: clickedTrackId },
          { click: false }
        );
      }
      clickedTrackId = properties.id;
      map.current.setFeatureState(
        { source: 'route', id: clickedTrackId },
        { click: true }
      );
    });
  }
}

export const addChartPoints = (map) => {
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