import { default as React } from "react"
import { connectHits } from 'react-instantsearch-dom';

import Tracks from "../../views/tracks"

const hits = connectHits((Hits) => {
  const { hits } = Hits;
  const tracks = hits.map((hit) => {
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
    return track;
  });
  return (
    <Tracks tracks={tracks} className="p-4 md:w-1/2" />
  )
});

export default hits;
