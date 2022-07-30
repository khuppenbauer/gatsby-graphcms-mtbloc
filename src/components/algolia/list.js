import { default as React } from "react"
import { useHits } from 'react-instantsearch-hooks-web';
import slugify from '@sindresorhus/slugify';
import { Link } from "gatsby"
import convert from "convert-units"
import { PlayCircle, StopCircle, Navigation } from "react-feather"

import { renderMetaData } from "../../helpers/track"

const Hit = ({ item }) => {
  let geoDistance
  let geoDistanceNumber
  let geoDistanceUnit
  const {
    name,
    endCity,
    endState,
    startCity,
    startState,
    startCountry,
    distance,
    totalElevationGain,
    totalElevationLoss,
    _rankingInfo,
  } = item;

  if (_rankingInfo && _rankingInfo.geoDistance) {
    geoDistance = convert(_rankingInfo.geoDistance).from("m").toBest()
    geoDistanceNumber = new Intl.NumberFormat("de-DE").format(geoDistance.val.toFixed(2))
    geoDistanceUnit = geoDistance.unit
  }

  const gatsbyPath = `/tracks/${slugify(name)}`;
  return (
    <tr>
      <td className="py-2 pr-4 border-b-2 border-gray-800">
        <Link to={gatsbyPath}>
          <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
            {startCountry}
          </h2>
          <h1 className="title-font text-lg font-medium text-white">
            {name}
          </h1>
          { geoDistanceNumber && geoDistanceUnit ? (
          <div className="mt-2">
            <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
              <Navigation className="w-4 h-4 mr-1" />
              {geoDistanceNumber} {geoDistanceUnit}
            </span>
          </div>
        ) : null }
        </Link>
      </td>
      <td className="py-2 pr-4 border-b-2 border-gray-800">
        <div className="flex flex-col">
          <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
            <PlayCircle className="w-4 h-4 mr-1" />
            {startCity} ({startState})
          </span>
          <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
            <StopCircle className="w-4 h-4 mr-1" />
            {endCity} ({endState})
          </span>
        </div>
      </td>
      <td className="py-2 border-b-2 border-gray-800">
        <div className="flex flex-col whitespace-nowrap">
          { renderMetaData({ distance, totalElevationGain, totalElevationLoss })}
        </div>
      </td>
    </tr>
  )
}

const List = (props) => {
  const { hits } = useHits(props);
  return (
    <table>
      <tbody>
        {hits && hits.map((hit) => {
          return <Hit key={hit.objectID} item={hit} />
        })}
      </tbody>
    </table>
  )
};

export default List;
