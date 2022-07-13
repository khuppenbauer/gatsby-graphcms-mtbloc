import { getBounds } from "geolib";
import slugify from '@sindresorhus/slugify';

export const getTracks = (geoJson, trackSorting) => {
  const tracks = geoJson.features
    .filter((feature) => feature.geometry.type === 'LineString')
  if (trackSorting) {
    return tracks
      .sort((a, b) => (a.properties[trackSorting] > b.properties[trackSorting]) ? 1 : -1);
  }
  return tracks;
}

export const getTrackPoints = (geoJson) => {
  const features = geoJson.features
    .filter((feature) => feature.geometry.type === 'LineString')
    .map((track) => {
      const { geometry, properties } = track;
      const index = Math.round(geometry.coordinates.length / 2);
      return {
        type: 'Feature',
        properties: {
          ...properties,
          bounds: getBounds(geometry.coordinates),
        },
        geometry: {
          type: 'Point',
          coordinates: geometry.coordinates[index],
        },
      }
    });
  return {
    type: 'FeatureCollection',
    features
  };
}

export const getRegions = (geoJson) => {
  return geoJson.features.filter((feature) => feature.geometry.type === 'Polygon');
}

export const getImages = (geoJson) => {
  return geoJson.features.filter((feature) => feature.properties.type === 'image');
}

export const getFeatures = (geoJson) => {
  return geoJson.features.reduce((acc, current) => {
    const { geometry, properties } = current;
    const type = geometry.type;
    acc[type] = acc[type] || [];
    if (!acc[type].includes(properties.type)) {
      acc[type].push(properties.type);
    }
    return acc;
    }, {});
}

export const getMapLayerFeatures = (geoJson) => {
  return geoJson.features.reduce((acc, current) => {
    const excludeTypes = ['trackPoint', 'image', 'regions'];
    const { geometry, properties } = current;
    const type = geometry.type;
    if (type !== 'LineString' && !excludeTypes.includes(properties.type)) {
      acc[type] = acc[type] || [];
      if (!acc[type].includes(properties.type)) {
        acc[type].push(properties.type);
      }
    }
    return acc;
    }, {});
}

export const parseAlgoliaHits = (data, layer) => {
  const features = data
    .filter((hit) => hit.type === layer)
    .map((feature) => {
      const { geometry, meta } = feature;
      return {
        type: 'Feature',
        properties: meta,
        geometry,
      }
    });
  return {
    type: 'FeatureCollection',
    features
  };
};

export const getCollectionsGeoJson = (collectionType) => {
  const stroke = '#ff3300';
  const strokeWidth = 2;
  const fillOpacity = 0;
  const coords = [];
  const features = [];
  const { slug, collections } = collectionType;
  collections.forEach(collection => {
    const { name: collectionName, slug: collectionSlug, minCoords, maxCoords } = collection;
    const { latitude: minLat, longitude: minLng } = minCoords;
    const { latitude: maxLat, longitude: maxLng } = maxCoords;
    const feature = {
      type: 'Feature',
      properties: {
        name: collectionName,
        type: slug,
        slug: `/${slug}/${collectionSlug ? collectionSlug : slugify(collectionName)}`,
        color: stroke,
        stroke,
        'stroke-width': strokeWidth,
        'fill-opacity': fillOpacity,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [minLng, minLat],
            [maxLng, minLat],
            [maxLng, maxLat],
            [minLng, maxLat],
            [minLng, minLat],
          ],
        ],
      },
    };
    coords.push(minCoords);
    coords.push(maxCoords);
    features.push(feature);
  });
  const geoJson = {
    type: 'FeatureCollection',
    features,
  };
  const { maxLat, maxLng, minLat, minLng } = getBounds(coords);
  const minCoords = {
    latitude: minLat,
    longitude: minLng,
  };
  const maxCoords = {
    latitude: maxLat,
    longitude: maxLng,
  };
  return {
    geoJson,
    minCoords,
    maxCoords,
  };
}
