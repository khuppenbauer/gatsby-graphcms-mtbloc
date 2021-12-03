export const getTracks = (geoJson) => {
  return geoJson.features.filter((feature) => feature.geometry.type === 'LineString');
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

export const getFeatureTypes = (geoJson) => {
  return geoJson.features.reduce((acc, current) => {
    const { properties, geometry } = current;
      if (geometry.type === 'Polygon') {
        if (!acc.includes(`${properties.type}-fill`)) {
          acc.push(`${properties.type}-fill`);
          acc.push(`${properties.type}-outline`);
        }
      } else {
        if (!acc.includes(properties.type)) {
          acc.push(properties.type);
        }
      }
    return acc;
    }, []);
}