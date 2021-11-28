import { useQueries } from "react-query";
import axios from "axios";

const getFeatures = async (minCoords, maxCoords, type) => {
  const url = '/api/feature-geo-intersect';

  const { latitude: minLat, longitude: minLng } = minCoords;
  const { latitude: maxLat, longitude: maxLng } = maxCoords;

  const body = {
    collection: "features",
    query: {
      type,
      "geometry": {
        $geoIntersects: {
          $geometry: {
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
          }
        }
      }
    }
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

export default function useFeatures(id, minCoords, maxCoords, types) {
  return useQueries(
    types.map((type) => {
      return {
        queryKey: [type, id],
        queryFn: () => getFeatures(minCoords, maxCoords, type),
      };
    })
  );
}