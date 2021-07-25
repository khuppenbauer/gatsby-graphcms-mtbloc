import React from "react"
import { graphql } from "gatsby"
import convert from "convert-units"
import { Play, Square, ArrowUpRight, ArrowDownRight, ArrowRight, ChevronUp, ChevronDown, Download } from "react-feather"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Section from "../../components/section"
import Mapbox from "../../components/mapbox"
import Headline from "../../views/headline"
import Tracks from "../../views/tracks"

const TrackPage = ({ data: { track } }) => {
  const {
    name,
    startCity,
    startState,
    startCountry,
    endCity,
    endState,
    endCountry,
    trip,
    gpxFileSmallUrl,
    gpxFileUrl,
    geoJson,
    minCoords,
    maxCoords,
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
  const elevHigh = new Intl.NumberFormat("de-DE").format(
    track.elevHigh.toFixed(2)
  )
  const elevLow = new Intl.NumberFormat("de-DE").format(
    track.elevLow.toFixed(2)
  )
  return (
    <Layout>
      <Seo title={name} />
      <Section>
        <Headline title={name} />
        <div className="mb-10">
          <Mapbox data={geoJson} minCoords={minCoords} maxCoords={maxCoords} />
        </div>
        <Headline title="Infos" />
        <div className="flex flex-wrap w-full mb-10">
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <Play className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {startCountry} / {startState} / {startCity}
              </span>
            </div>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <Square className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {endCountry} / {endState} / {endCity}
              </span>
            </div>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <ArrowUpRight className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {totalElevationGain} m
              </span>
            </div>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <ArrowDownRight className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {totalElevationLoss} m
              </span>
            </div>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <ChevronUp className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {elevHigh} m
              </span>
            </div>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <ChevronDown className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {elevLow} m
              </span>
            </div>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <div className="bg-gray-800 rounded flex p-4 h-full items-center">
              <ArrowRight className="text-blue-500 h-8 w-8" />
              <span className="title-font font-medium text-white px-2">
                {number} {unit}
              </span>
            </div>
          </div>
        </div>
        <Headline title="Downloads" />
        <div className="flex flex-wrap w-full mb-10">
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <a href={gpxFileUrl}>
              <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                <Download className="text-white h-8 w-8" />
                <span className="title-font font-medium text-white px-2">
                  GPX
                </span>
              </div>
            </a>
          </div>
          <div className="pr-4 pb-4 sm:w-1/2 w-full">
            <a href={gpxFileSmallUrl}>
              <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                <Download className="text-white h-8 w-8" />
                <span className="title-font font-medium text-white px-2">
                  GPX komprimiert
                </span>
              </div>
            </a>
          </div>
        </div>
        {trip ? <Tracks name={trip.name} tracks={trip.tracks} /> : null}
      </Section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query TrackPageQuery($name: String!) {
    track: graphCmsTrack(name: { eq: $name }) {
      name
      startCity
      startState
      startCountry
      endCity
      endState
      endCountry
      totalElevationGain
      totalElevationLoss
      distance
      elevHigh
      elevLow
      trip {
        name
        tracks {
          id
          gatsbyPath(filePath: "/tracks/{graphCmsTrack.name}")
          distance
          endCity
          endCountry
          endState
          name
          startCity
          startCountry
          startState
          staticImageUrl
          totalElevationGain
          totalElevationLoss
        }
      }
      geoJsonFileUrl
      gpxFileSmallUrl
      gpxFileUrl
      geoJson
      maxCoords {
        latitude
        longitude
      }
      minCoords {
        latitude
        longitude
      }
      photos {
        handle
        width
        height
        location {
          latitude
          longitude
        }
      }
    }
  }
`

export default TrackPage
