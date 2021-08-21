import React from "react"
import { Link } from "gatsby"
import convert from "convert-units"
import { PlayCircle, StopCircle, ArrowUpCircle, ArrowDownCircle, ArrowRightCircle } from "react-feather"

import Headline from "./headline"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const Track = ({ track, className }) => {
  const {
    id,
    name,
    gatsbyPath,
    endCity,
    endState,
    startCity,
    startState,
    startCountry,
    staticImageUrl,
  } = track
  const distance = convert(track.distance).from("m").toBest()
  const number = new Intl.NumberFormat("de-DE").format(distance.val.toFixed(2))
  const unit = distance.unit
  const totalElevationGain = new Intl.NumberFormat("de-DE").format(
    track.totalElevationGain.toFixed(2)
  )
  const totalElevationLoss = new Intl.NumberFormat("de-DE").format(
    track.totalElevationLoss.toFixed(2)
  )
  let asset;
  if (staticImageUrl) {
    const handle = staticImageUrl.replace(assetBaseUrl, "")
    asset = `${assetBaseUrl}/resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`  
  }
  return (
    <div key={id} className={className}>
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        <Link to={gatsbyPath}>
          { asset ? (
            <img
              className="w-full object-cover object-center"
              src={asset}
              alt={name}
              width="320"
              height="240"
          />
          ) : null}
          <div className="p-6">
            <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
              {startCountry}
            </h2>
            <h1 className="title-font text-lg font-medium text-white mb-3">
              {name}
            </h1>
            <div className="my-4">
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <PlayCircle className="w-4 h-4 mr-1" />
                {startCity} ({startState})
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <StopCircle className="w-4 h-4 mr-1" />
                {endCity} ({endState})
              </span>
            </div>
            <div className="flex items-center flex-wrap ">
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <ArrowRightCircle className="w-4 h-4 mr-1" />
                {number} {unit}
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <ArrowUpCircle className="w-4 h-4 mr-1" />
                {totalElevationGain} m
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <ArrowDownCircle className="w-4 h-4 mr-1" />
                {totalElevationLoss} m
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

const Tracks = ({ name, description, tracks, className }) => {
  return (
    <>
      {name || description ? (
        <Headline title={name} description={description} />
      ) : null}
      <div className="flex flex-wrap -m-4">
        {tracks.map(track => {
          const { id } = track
          return <Track key={id} track={track} className={className || 'p-4 md:w-1/3 xl:w-1/5'} />
        })}
      </div>
    </>
  )
}

export default Tracks
