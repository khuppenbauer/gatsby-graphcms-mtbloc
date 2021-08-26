import { default as React } from "react"
import { connectHits } from 'react-instantsearch-dom';
import slugify from '@sindresorhus/slugify';

import Tracks from "../../views/tracks"

const hits = connectHits((Hits) => {
  const { hits } = Hits;
  const tracks = hits.map((hit) => {
    let geoDistance;
    const { 
      objectID: id, name, _rankingInfo,
      endCity, endState, 
      startCity, startState, startCountry, 
      distance, totalElevationGain, totalElevationLoss, 
      staticImageUrl
    } = hit;
    if (_rankingInfo && _rankingInfo.geoDistance) {
      geoDistance = _rankingInfo.geoDistance;
    }
    const gatsbyPath = `/tracks/${slugify(name)}`;
    const track = {
      id,
      name,
      gatsbyPath,
      endCity,
      endState,
      startCity,
      startState,
      startCountry,
      staticImageUrl,
      distance,
      totalElevationGain,
      totalElevationLoss,
      geoDistance,
    };
    return track;
  });
  return (
    <Tracks tracks={tracks} className="p-4 md:w-1/2 xl:w-1/4" />
  )
});

export default hits;
