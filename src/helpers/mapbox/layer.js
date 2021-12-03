import React from "react"
import mapboxgl from "mapbox-gl"
import slugify from "@sindresorhus/slugify"
import { renderToString } from 'react-dom/server';

import { renderMetaData } from "../track" 
import { getFeatures, getTracks } from "../geoJson"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

export const addLayers = (map, geoJson, mapType) => {
  const features = getFeatures(geoJson);
  const tracks = getTracks(geoJson);
  const { Point: symbols, Polygon: areas } = features;
  if (areas) {
    areas.forEach((area) => {
      addArea(map, area);
    })
  }
  if (tracks) {
    tracks.forEach((track) => {
      const source = `track-${track.properties.name}`;
      addTrack(map, source, mapType);
    })
    if (tracks.length > 1) {
      tracks.forEach((track) => {
        const source = `track-${track.properties.name}-point`;
        addTrackPoint(map, source, mapType);
      })
    }
  }
  if (symbols) {
    symbols.forEach((symbol) => {
      addSymbol(map, symbol);
    });
  }
}

export const addArea = (map, type) => {
  if (map) {
    map.addLayer({
      id: `${type}-fill`,
      type: 'fill',
      source: 'features',
      paint: {
        'fill-color': [
          'get', 'color',
        ],
        'fill-opacity': 0.07,
      },
      layout: {
        'visibility': 'none',
      },
      filter: ['==', '$type', 'Polygon'],
    });
      
    map.addLayer({
      id: `${type}-outline`,
      type: 'line',
      source: 'features',
      paint: {
        'line-color': [
          'get', 'color',
        ],  
        'line-width': 1,
      },
      layout: {
        'visibility': 'none',
      },
      filter: ['==', '$type', 'Polygon'],
    });

    map.on('mouseenter', `${type}-fill`, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', `${type}-fill`, () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', `${type}-fill`, (e) => {
      const { properties } = e.features[0];
      let html;
      if (type === 'book') {
        const {
          title,
          url,
        } = properties;
        html = `<a href="${url}" target="_blank">${title}</a>`;
      }
      if (type === 'map') {
        const {
          article,
          name,
          scale,
          url,
        } = properties;
        html = `<a href="${url}" target="_blank">${article}<br />${name}<br />1:${scale}</a>`; 
      }
      if (type === 'regions') {
        const { name } = properties;
        const url = `/regions/${slugify(name)}`;
        html = `<a href="${url}">${name}</a>`;
      }
      if (html) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
      }
    });
  }
}

export const addSymbol = (map, type) => {
  if (map) {
    let icon;
    if (type === 'image') {
      icon = 'attraction';
    }
    if (type === 'pass') {
      icon = 'mountain';
    }
    if (type === 'residence') {
      icon = 'town-hall';
    }
    map.addLayer({
      id: type,
      type: 'symbol',
      source: 'features',
      layout: {
        'icon-image': `${icon}-15`,
        'icon-allow-overlap': true,
        'visibility': 'none',
      },
      filter: ['==', 'type', type],
    });

    map.on('mouseenter', type, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', type, () => {
      map.getCanvas().style.cursor = '';
    });

    if (type === 'image') {
      map.on('click', type, (e) => {
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
            .setLngLat(map.getCenter())
            .setHTML(html)
            .addTo(map);
        }
      });
    } else {
      map.on('click', type, (e) => {
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
          .addTo(map);
      });
    }
  }
}

export const addTrack = (map, source, mapType) => {
  if (map) {
    if (mapType === 'collection') {
      map.addLayer({
        id: `${source}-border`,
        type: 'line',
        source: `${source}-border`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible',
        },
        paint: {
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'click'], false],
            5,
            0
          ],
          'line-color': 'green',
        },
      })
    }
    map.addLayer({
      id: source,
      type: 'line',
      source,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
        'visibility': 'visible',
      },
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
      },
    })
  }
}

export const addTrackPoint = (map, source, mapType) => {
  if (map) {
    map.addLayer({
      id: `${source}-circle`,
      type: 'circle',
      source,
      paint: {
        'circle-color': '#fff',
        'circle-radius': 10,
        'circle-stroke-width': 2,
        'circle-stroke-color': [
          'get', 'color',
        ],
      },
      layout: {
        'visibility': 'visible',
      },
    });
    map.addLayer({
      id: source,
      type: 'symbol',
      source,
      layout: {
        'icon-image': 'bicycle-15',
        'icon-allow-overlap': true,
        'visibility': 'visible',
      },
    });

    map.on('mouseenter', source, () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', source, () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', source, (e) => {
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
      let html;
      if (mapType === 'collection') {
        const url = `/tracks/${slugify(name)}`;
        html = `<a href="${url}">${renderToString(text)}</a>`;
      } else {
        html = renderToString(text);
      }

      if (html) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(html)
        .addTo(map);
      }
      if (mapType === 'collection' && properties.id) {   
        unselectAllTracks(map);
        selectTrack(map, name, properties.name);
      }
    });
  }
}

export const selectTrack = (map, name, id) => {
  const allLayers = map.getStyle().layers;     
  const layers = allLayers.filter((layer) => layer.id.startsWith('track-'));
  const before = layers[layers.length - 1];
  const beforeIndex = allLayers.findIndex(i => i.id === before.id);
  map.setFeatureState(
    { source: `track-${name}-border`, id },
    { click: true }
  );
  const moveLayer = allLayers[beforeIndex + 1] ? allLayers[beforeIndex + 1].id : null;
  map.moveLayer(`track-${name}-border`, moveLayer);
  map.moveLayer(`track-${name}`, moveLayer);
  layers.forEach((layer) => {
    if (layer.id.includes('-point')) {
      map.moveLayer(layer.id, moveLayer);  
    }
  })
}

export const unselectAllTracks = (map) => {
  const allLayers = map.getStyle().layers;     
  const layers = allLayers.filter((layer) => layer.id.startsWith('track-'));
  layers.forEach((layer) => {
    if (layer.id.endsWith('-border')) {
      map.setFeatureState(
        { source: layer.id, id: layer.id.replace(/track-|-border/g,'') },
        { click: false }
      );
    }
  })
}

export const setTrackVisibility = (map, track, visibility) => {
  map.setLayoutProperty(`track-${track}`, 'visibility', visibility);
  map.setLayoutProperty(`track-${track}-border`, 'visibility', visibility);
  map.setLayoutProperty(`track-${track}-point`, 'visibility', visibility);
  map.setLayoutProperty(`track-${track}-point-circle`, 'visibility', visibility);
}
