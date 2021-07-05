import React from "react"
import { Link } from "gatsby"
import {
  ArrowSmUpIcon,
  ArrowSmDownIcon,
  ArrowSmRightIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/outline"
import convert from "convert-units"

import Headline from "./headline"

const assetBaseUrl = "https://media.graphcms.com/"

const Track = ({ track }) => {
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
    totalElevationGain,
    totalElevationLoss,
  } = track
  const distance = convert(track.distance).from("m").toBest()
  const number = new Intl.NumberFormat("de-DE").format(distance.val.toFixed(2))
  const unit = distance.unit
  const handle = staticImageUrl.replace(assetBaseUrl, "")
  const asset = `${assetBaseUrl}resize=w:320,h:240,fit:crop/auto_image/compress/${handle}`
  return (
    <div key={id} className="p-4 md:w-1/3">
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        <Link to={gatsbyPath}>
          <img
            className="w-full object-cover object-center"
            src={asset}
            alt={name}
            width="320"
            height="240"
          />
          <div className="p-6">
            <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1 uppercase">
              {startCountry}
            </h2>
            <h1 className="title-font text-lg font-medium text-white mb-3">
              {name}
            </h1>
            <div className="my-4">
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <PlayIcon className="h-6 w-6" />
                {startCity} ({startState})
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <StopIcon className="h-6 w-6" />
                {endCity} ({endState})
              </span>
            </div>
            <div className="flex items-center flex-wrap ">
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <ArrowSmRightIcon className="h-6 w-6" />
                {number} {unit}
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <ArrowSmUpIcon className="h-6 w-6" />
                {totalElevationGain} m
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                <ArrowSmDownIcon className="h-6 w-6" />
                {totalElevationLoss} m
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

const Tracks = ({ name, description, tracks }) => (
  <section className="text-gray-400 bg-gray-900 body-font">
    <div className="container px-5 py-12 mx-auto">
      {name || description ? (
        <Headline title={name} description={description} />
      ) : null}
      <div className="flex flex-wrap -m-4">
        {tracks.map(track => {
          const { id } = track
          return <Track key={id} track={track} />
        })}
      </div>
    </div>
  </section>
)

export default Tracks
