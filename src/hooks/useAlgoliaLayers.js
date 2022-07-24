import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getFeatures = async (minCoords, maxCoords) => {
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
    hitsPerPage: 0,
    facets: [ '*' ],
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

export default function useAlgoliaLayers(id, minCoords, maxCoords) {
  return useQuery(["layers", id], () => getFeatures(minCoords, maxCoords));
}