import React from "react"
import { Link } from "gatsby"
import convert from "convert-units"
import { PlayCircle, StopCircle, Navigation } from "react-feather"
import slugify from '@sindresorhus/slugify';

import Header from "./header"
import Image from "./image"
import { renderMetaData } from "../helpers/track"

const cloudinaryBaseUrl = process.env.GATSBY_CLOUDINARY_BASE_URL
const cloudinaryAppId = process.env.GATSBY_CLOUDINARY_APP_ID

const Track = ({ track, className }) => {
  let geoDistance
  let geoDistanceNumber
  let geoDistanceUnit
  const {
    id,
    name,
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
  } = track

  if (track.geoDistance) {
    geoDistance = convert(track.geoDistance).from("m").toBest()
    geoDistanceNumber = new Intl.NumberFormat("de-DE").format(geoDistance.val.toFixed(2))
    geoDistanceUnit = geoDistance.unit
  }

  let assets = [];
  if (previewImageUrl) {
    const preview = previewImageUrl.split('/preview/');
    let previewImage = previewImageUrl;
    if(preview[1]) {
      previewImage = `${cloudinaryBaseUrl}/q_auto:eco/${cloudinaryAppId}/preview/${preview[1].replace(/.jpg/g, '.webp')}`;
    }
    assets.push({
      key: previewImage,
      id: slugify(`preview-${id}`),
      src: previewImage,
      title: previewImage,
      button: 'map-pin',
    });
  }
  if (overviewImageUrl) {
    const overview = overviewImageUrl.split('/preview/');
    let overviewImage = overviewImageUrl;
    if(overview[1]) {
      overviewImage = `${cloudinaryBaseUrl}/q_auto:eco/${cloudinaryAppId}/overview/${overview[1].replace(/.png/g, '.webp')}`;
    }
    assets.push({
      key: overviewImage,
      id: slugify(`overview-${id}`),
      src: overviewImage,
      title: overviewImage,
      button: 'map'
    });
  }

  return (
    <div key={id} className={className}>      
      <div className="h-full border-2 border-gray-800 rounded-lg overflow-hidden">
        {assets.length > 0 ? (
          <Image id={id} assets={assets} slug={gatsbyPath} />
        ) : null}
        <Link to={gatsbyPath}>
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
            <div className="flex items-center flex-wrap my-4">
              { renderMetaData({ distance, totalElevationGain, totalElevationLoss })}
            </div>
            { geoDistanceNumber && geoDistanceUnit ? (
              <div className="my-4">
                <span className="text-gray-500 inline-flex items-center lg:mr-auto md:mr-0 mr-auto leading-none text-sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  {geoDistanceNumber} {geoDistanceUnit}
                </span>
              </div>
            ) : null }
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
        <Header title={name} description={description} />
      ) : null}
      <div className="flex flex-wrap -m-4">
        {tracks ? tracks.map(track => {
          const { id } = track
          return <Track key={id} track={track} className={className || 'p-4 md:w-1/3'} />
        }) : null}
      </div>
    </>
  )
}

export default Tracks
