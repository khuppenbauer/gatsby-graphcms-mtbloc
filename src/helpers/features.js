import axios from "axios";

export const getAlgoliaFeatures = async (minCoords, maxCoords, types) => {
  const url = '/api/algolia';

  const { latitude: minLat, longitude: minLng } = minCoords;
  const { latitude: maxLat, longitude: maxLng } = maxCoords;

  let query = {
    insideBoundingBox: [
      [
        minLat, 
        minLng, 
        maxLat, 
        maxLng,
      ]
    ],
    hitsPerPage: 100,
  }
  if (types.length > 0) {
    const facets = types.map((type) => {
      return `type:${type}`;
    });
    query = {
      ...query,
      facetFilters: [
        facets
      ],
    };
  }
  const body = {
    index: "feature",
    query,
  };

  const { data } = await axios({
    url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(body),
  });
  return data;
}
