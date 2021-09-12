import React from "react"
import { graphql } from "gatsby"
import convert from "convert-units"
import { Play, Square, ArrowUpRight, ArrowDownRight, ArrowRight, ChevronUp, ChevronDown, Download } from "react-feather"
import slugify from '@sindresorhus/slugify';

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Section from "../../components/section"
import Map from "../../components/mapChart"
import Headline from "../../views/headline"
import Teaser from "../../views/teaser"
import ImageSlider from "../../views/imageSlider"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL

const TrackPage = ({ data: { track } }) => {
  const {
    name,
    startCity,
    startState,
    startCountry,
    endCity,
    endState,
    endCountry,
    collection,
    gpxFileSmallUrl,
    gpxFileUrl,
    geoJson,
    minCoords,
    maxCoords,
    photos,
    staticImageUrl,
  } = track

  const assets = []; 
  const features = photos.map((photo) => {
    const { id, handle, fileName, location, width, height } = photo;
    const { latitude, longitude } = location;
    const orientation = width > height ? 'landscape' : 'portrait';
    assets.push({
      key: id,
      id: handle,
      src: `${assetBaseUrl}/resize=h:320,fit:crop/auto_image/compress/${handle}`,
      title: fileName,
      orientation,
    });
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          longitude,
          latitude
        ]
      },
      properties: {
        id,
        handle, 
        fileName,
        width,
        height,
        orientation,
      }
    }
  });
  if (features) {
    geoJson.features.push(...features);
  }
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
      <Seo title={name} image={staticImageUrl} />
      <Section>
        <Headline title={name} />
        <Map data={geoJson} minCoords={minCoords} maxCoords={maxCoords} distance={track.distance} />
        {assets.length > 0 ? (
          <>
            <Headline title="Fotos" />
            <div className="flex flex-wrap w-full mb-10">
              <div className="pr-4 pb-4 sm:w-1/2 w-full">
                <ImageSlider images={assets} />
              </div>
            </div>
          </>
        ) : null}
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
        {collection.length > 0 ? 
          (
            <>
            <Headline title="Kategorien" />
              <div className="flex flex-wrap -m-4 mb-10">
                {collection.map(collectionItem => {
                  const { 
                    id: collectionId, 
                    name: collectionName, 
                    staticImage,
                    image,
                    tracks,
                    collectionType,
                  } = collectionItem;
                  const { slug } = collectionType;
                  const tracksCount = tracks.length;
                  return <Teaser key={collectionId} id={collectionName} slug={`/${slug}/${slugify(collectionName)}`} title={`${collectionName} (${tracksCount})`} image={image} staticImage={staticImage} />
                })}
              </div>
            </>
          ) : null
        }
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
      collection {
        id
        name
        tracks {
          id
        }
        image {
          id
          handle
        }
        staticImage {
          id
          handle
        }
        collectionType {
          id
          name
          slug
        }
      }
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
        id
        fileName
        handle
        location {
          latitude
          longitude
        }
        width
        height
      }
      staticImageUrl
    }
  }
`

export default TrackPage
