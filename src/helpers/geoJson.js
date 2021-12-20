export const getTracks = (geoJson) => {
  return geoJson.features.filter((feature) => feature.geometry.type === 'LineString');
}

export const getRegions = (geoJson) => {
  return geoJson.features.filter((feature) => feature.properties.type === 'regions');
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
