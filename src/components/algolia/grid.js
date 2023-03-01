import { default as React } from "react"
import { useHits } from 'react-instantsearch-hooks-web';

import Tracks from "../../views/tracks"


const Grid = (props) => {
  const { hits } = useHits(props);
  const tracks = [];
  hits.forEach((hit) => {
    let geoDistance;
    const { 
      objectID: id, title, slug, _rankingInfo,
      endCity, endState, 
      startCity, startState, startCountry, 
      distance, totalElevationGain, totalElevationLoss, 
      previewImageUrl, overviewImageUrl,
    } = hit;
    if (hit.private) {
      return null;
    }
    if (_rankingInfo && _rankingInfo.geoDistance) {
      geoDistance = _rankingInfo.geoDistance;
    }
    const gatsbyPath = `/tracks/${slug}`;
    const track = {
      id,
      title,
      gatsbyPath,
      endCity,
      endState,
      startCity,
      startState,
      startCountry,
      previewImageUrl,
      overviewImageUrl,
      distance,
      totalElevationGain,
      totalElevationLoss,
      geoDistance,
    };
    tracks.push(track);
  });
  return (
    <Tracks tracks={tracks} className="p-4 md:w-1/2" />
  )
}

export default Grid;
