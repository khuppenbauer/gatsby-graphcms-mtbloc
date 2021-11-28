import React from "react"
import mapboxgl from "mapbox-gl"
import slugify from "@sindresorhus/slugify"
import { renderToString } from 'react-dom/server';

import { renderMetaData } from "../track" 

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

export const addLayers = (map, geoJsonData, mapType) => {
  const trackFeatures = geoJsonData.features
    .filter((feature) => feature.geometry.type === 'LineString');
  const features = geoJsonData.features.reduce((acc, current) => {
    const { geometry, properties } = current;
    const type = properties.type === 'trackPoint' ? 'TrackPoint' : geometry.type;
    acc[type] = acc[type] || [];
    if (!acc[type].includes(properties.type)) {
      acc[type].push(properties.type);
    }
    return acc;
  }, {});
  const { Point: symbols, LineString: tracks, Polygon: areas, TrackPoint: trackPoints } = features;
  if (areas) {
    areas.forEach((area) => {
      addArea(map, area);
    })
  }
  if (mapType !== 'collection' && tracks) {
    addTrack(map);
  }
  if (symbols) {
    symbols.forEach((symbol) => {
      addSymbol(map, symbol);
    });
  }
  if (trackFeatures.length > 1 && trackPoints) {
    addTrackPoint(map, mapType);
  }
}

export const addArea = (map, type) => {
  if (map.current) {
    map.current.addLayer({
      id: `${type}-fill`,
      type: 'fill',
      source: 'features',
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
      source: 'features',
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

    map.current.on('click', `${type}-fill`, (e) => {
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
        .addTo(map.current);
      }
    });
  }
}

export const addSymbol = (map, type) => {
  if (map.current) {
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
    console.log([type, icon]);
    map.current.addLayer({
      id: type,
      type: 'symbol',
      source: 'features',
      layout: {
        'icon-image': `${icon}-15`,
        'icon-allow-overlap': true,
      },
      filter: ['==', 'type', type],
    });

    map.current.on('mouseenter', type, () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', type, () => {
      map.current.getCanvas().style.cursor = '';
    });

    if (type === 'image') {
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
    } else {
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
}

export const addTrack = (map, source, mapType) => {
  if (map.current) {
    if (mapType === 'collection') {
      map.current.addLayer({
        id: `${source}-border`,
        type: 'line',
        source: `${source}-border`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
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
    map.current.addLayer({
      id: source,
      type: 'line',
      source,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
      },
    })
  }
}

export const addTrackPoint = (map, mapType) => {
  if (map.current) {
    const type = 'trackPoint';
    map.current.addLayer({
      id: `${type}-circle`,
      type: 'circle',
      source: 'features',
      paint: {
        'circle-color': '#fff',
        'circle-radius': 10,
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
      source: 'features',
      layout: {
        'icon-image': 'bicycle-15',
        'icon-allow-overlap': true,
      },
      filter: ['==', 'type', type],
    });

    map.current.on('mouseenter', type, () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', type, () => {
      map.current.getCanvas().style.cursor = '';
    });

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
        .addTo(map.current);
      }
      if (mapType === 'collection' && properties.id) {   
        const allLayers = map.current.getStyle().layers;     
        const layers = allLayers.filter((layer) => layer.id.startsWith('track-'));
        const before = layers[layers.length - 1];
        const beforeIndex = allLayers.findIndex(i => i.id === before.id);
        if (clickedTrackId) {
          layers.forEach((layer) => {
            map.current.setFeatureState(
              { source: `${layer.id}`, id: clickedTrackId },
              { click: false }
            );
          })
        }
        clickedTrackId = properties.id;
        map.current.setFeatureState(
          { source: `track-${name}-border`, id: clickedTrackId },
          { click: true }
        );
        map.current.moveLayer(`track-${name}-border`, allLayers[beforeIndex + 1].id);
        map.current.moveLayer(`track-${name}`, allLayers[beforeIndex + 1].id);
      }
    });
  }
}
