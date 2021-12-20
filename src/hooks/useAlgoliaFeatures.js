import { useQuery } from "react-query";
import axios from "axios";

const getFeatures = async (minCoords, maxCoords, facets) => {
  const url = '/api/algolia';

  const { latitude: minLat, longitude: minLng } = minCoords;
  const { latitude: maxLat, longitude: maxLng } = maxCoords;

  const query = {
    insideBoundingBox: [
      [
        minLat, 
        minLng, 
        maxLat, 
        maxLng,
      ]
    ],
    facetFilters: [
      facets
    ],
    hitsPerPage: 1000,
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

export default function useAlgoliaFeatures(id, minCoords, maxCoords, types) {
  const facets = types.map((type) => {
    return `type:${type}`;
  });
  return useQuery(["features", id], () => getFeatures(minCoords, maxCoords, facets));
}