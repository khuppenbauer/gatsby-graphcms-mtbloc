import React from "react"
import mapboxgl from "mapbox-gl"
import slugify from "@sindresorhus/slugify"
import { renderToString } from 'react-dom/server';
import { getBounds } from "geolib";

import geoViewport from '@mapbox/geo-viewport';

import { renderMetaData, convertMetaData } from "../track" 
import { getTracks } from "../geoJson"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

export const addLayers = (map, geoJson, mapType, mapSource) => {
  const tracks = getTracks(geoJson);
  if (tracks) {
    tracks.forEach((track) => {
      const source = `track-${track.properties.name}`;
      addTrack(map, source, mapType, mapSource);
    })
    if (tracks.length > 1) {
      tracks.forEach((track) => {
        const source = `track-${track.properties.name}-point`;
        addTrackPoint(map, source, mapType, mapSource);
      })
    }
  }
}

export const addArea = (map, type, source) => {
  if (map) {
    map.addLayer({
      id: `${type}-fill`,
      type: 'fill',
      source,
      paint: {
        'fill-color': [
          'get', 'color',
        ],
        'fill-opacity': 0.07,
      },
      layout: {
        visibility: 'visible',
      },
      filter: ['==', '$type', 'Polygon'],
    });
      
    map.addLayer({
      id: `${type}-outline`,
      type: 'line',
      source,
      paint: {
        'line-color': [
          'get', 'color',
        ],  
        'line-width': 1,
      },
      layout: {
        visibility: 'visible',
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
      let html;
      html = e.features.map((feature) => {
        if (type === 'book') {
          const { title, url } = feature.properties;
          return `<li><a href="${url}" target="_blank">${title}</a></li>`;
        }
        if (type === 'map') {
          const { article, name, scale, url } = feature.properties;
          return `<li><a href="${url}" target="_blank">${article}<br />${name}<br />1:${scale}</a></li>`;
        }
        if (type === 'regions') {
          const { name, slug } = feature.properties;
          const url = slug ? slug : `/regions/${slugify(name)}`;
          return `<li><a href="${url}">${name}</a></li>`;
        }
        return null;
      })
      if (html) {
        new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`<ul>${html.join('<br />')}</ul>`)
        .addTo(map);
      }
    });
  }
}

export const addCluster = (map, mapSource) => {
  if (map) {
    const visibility = mapSource === 'cluster' ? 'visible' : 'none';
    map.addLayer({
      id: 'cluster',
      type: 'circle',
      source: 'cluster',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          15,
          '#f1f075',
          30,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          15,
          30,
          30,
          40
        ]
      },
      layout: {
        visibility,
      },
    });

    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'cluster',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
        visibility,
      }
    });
        
    map.addLayer({
      id: 'unclustered-point-circle',
      type: 'circle',
      source: 'cluster',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#fff',
        'circle-radius': 10,
        'circle-stroke-width': 2,
        'circle-stroke-color': [
          'get', 'color',
        ],
      },
      layout: {
        visibility,
      },
    });

    map.addLayer({
      id: 'unclustered-point',
      type: 'symbol',
      source: 'cluster',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'bicycle-15',
        'icon-allow-overlap': true,
        visibility,
      },
    });

    map.on('click', 'cluster', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['cluster']
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('cluster').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if (err) return;         
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom + 1,
          });
        }
      );
    });

    // show tooltip for clusters
    const tooltip = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: 'left',
      offset: 20,
    })

    map.on('mouseenter', 'cluster', ({ features: [feature] }) => {
      map.getCanvas().style.cursor = 'pointer'

      const clusterId = feature.properties.cluster_id

      map
        .getSource('cluster')
        .getClusterLeaves(clusterId, Infinity, 0, (err, children) => {
          if (err) return
          let names = children
            .slice(0, 6)
            .map(({ properties }) => {
              const { name, title } = properties;
              const { distance, totalElevationGain, totalElevationLoss } = convertMetaData(properties);
              const text = (
                <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
                  {title || name}<br />({`${distance} | ${totalElevationGain} | ${totalElevationLoss}`})
                </span>
              );
              return renderToString(text);
            })
            .join('<br/>')
            if (children.length > 6) {
              names += `<br/>and ${children.length - 6} more...`
            }
          tooltip
            .setLngLat(feature.geometry.coordinates)
            .setHTML(names)
            .addTo(map)
        })
    })

    map.on('mouseleave', 'cluster', () => {
      map.getCanvas().style.cursor = '';
      tooltip.remove();
    });

    map.on('click', 'unclustered-point', (e) => {
      const track = {
        properties: e.features[0].properties,
        geometry: e.features[0].geometry,
      };
      const name = track.properties.name;
      setTrackVisibility(map, name, 'visible');
      const bounds = JSON.parse(track.properties.bounds);
      const { width, height } = map._canvas;
      const { center, zoom } = geoViewport.viewport([
        bounds.minLng,
        bounds.minLat,
        bounds.maxLng,
        bounds.maxLat,
      ], [width, height]);
      unselectAllTracks(map);
      selectTrack(map, name, name);
      map.flyTo({
        center,
        zoom: zoom - 2,
      });
    });

    map.on('mouseenter', 'unclustered-point', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
    });
  }
}

export const addSymbol = (map, type, source) => {
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
      source,
      layout: {
        'icon-image': `${icon}-15`,
        'icon-allow-overlap': true,
        visibility: 'visible',
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
          html = `<div style="width: 200px; height: 200px; overflow-y: auto;">${html}<br />${desc}<br />${cmt.replace(/\r\n/g, '<br /></div>')}`;
        }
  
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(map);
      });
    }
  }
}

export const addTrack = (map, source, mapType, mapSource) => {
  if (map) {
    const visibility = mapSource === 'track' ? 'visible' : 'none';
    if (mapType === 'collection') {
      map.addLayer({
        id: `${source}-border`,
        type: 'line',
        source: `${source}-border`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility,
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
        visibility,
      },
      paint: {
        'line-width': 3,
        'line-color': ['get', 'color'],
      },
    })
  }
}

export const addTrackPoint = (map, source, mapType, mapSource) => {
  if (map) {
    const visibility = mapSource === 'track' ? 'visible' : 'none';
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
        visibility,
      },
    });
    map.addLayer({
      id: source,
      type: 'symbol',
      source,
      layout: {
        'icon-image': 'bicycle-15',
        'icon-allow-overlap': true,
        visibility,
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
      const { name, slug, title } = properties;
      const text = (
        <>
          <div>
            <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm py-1">
              {title || name}
            </span>
          </div>
          <div className="flex items-center flex-wrap">
            {renderMetaData(properties)}
          </div>
        </>
      );
      let html;
      if (mapType === 'collection') {
        const url = `/tracks/${slug}`;
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

export const setClusterVisibility = (map, visibility) => {
  map.setLayoutProperty('cluster', 'visibility', visibility);
  map.setLayoutProperty('cluster-count', 'visibility', visibility);
  map.setLayoutProperty('unclustered-point', 'visibility', visibility);
  map.setLayoutProperty('unclustered-point-circle', 'visibility', visibility);
}

export const flyTo = (map, track) => {
  const { geometry, properties } = track;
  const { name } = properties;
  const { coordinates } = geometry;
  const bounds = getBounds(coordinates);
  const { width, height } = map._canvas;
  const { center, zoom } = geoViewport.viewport([
    bounds.minLng,
    bounds.minLat,
    bounds.maxLng,
    bounds.maxLat,
  ], [width, height]);
  unselectAllTracks(map);
  selectTrack(map, name, name);
  map.flyTo({
    center,
    zoom: zoom - 2,
  });
}
