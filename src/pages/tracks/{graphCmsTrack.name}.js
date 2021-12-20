import React from "react"
import { graphql } from "gatsby"
import { Play, Square, ArrowUpRight, ArrowDownRight, ArrowRight, ChevronUp, ChevronDown, Download } from "react-feather"
import slugify from '@sindresorhus/slugify';
import { QueryClient, QueryClientProvider } from "react-query";

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Map from "../../components/mapChart"
import Headline from "../../views/headline"
import Teaser from "../../views/teaser"
import ImageSlider from "../../views/imageSlider"
import Features from "../../views/features"
import useAlgoliaFeatures from "../../hooks/useAlgoliaFeatures"
import useAlgoliaLayers from "../../hooks/useAlgoliaLayers"
import { convertMetaData } from "../../helpers/track"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL
const queryClient = new QueryClient();

const teaser = ['map', 'book', 'track', 'image'];

const FeatureTeaser = ({ 
  id, minCoords, maxCoords, tracks,
}) => {
  const { status, data } = useAlgoliaFeatures(id, minCoords, maxCoords, teaser);
  if (status === 'success') {
    const { hits } = data;
    return teaser.map((item) => {
      const items = hits.filter((feature) => feature.type === item);
      if (items.length > 0) {
        return (
          <Features key={item} type={item} data={items} tracks={tracks} />
        );
      } else {
        return null;
      }
    });
  }
  return null;
};

const FeatureMap = ({ 
  id, minCoords, maxCoords, geoJson, distance,
}) => {
  const { status, data } = useAlgoliaLayers(id, minCoords, maxCoords);
  if (status === 'success') {
    const { facets } = data;
    const layers = Object.keys(facets.type);
    return (
      <Map
        id={id}
        data={geoJson}
        minCoords={minCoords}
        maxCoords={maxCoords}
        distance={distance}
        layers={layers}
      />
    );
  }
  return null;
};

const Assets = ({ assets }) => (
  assets.length > 0 ? (
    <>
      <Headline title="Fotos" />
      <div className="flex flex-wrap w-full mb-10">
        <div className="pr-4 pb-4 w-full">
          <ImageSlider images={assets} />
        </div>
      </div>
    </>
  ) : null
)

const Collections = ({collections}) => (
  collections.length > 0 ? (
    <>
      <Headline title="Kategorien" />
      <div className="flex flex-wrap -m-4 mb-10">
        {collections.map(collectionItem => {
          const { 
            id: collectionId, 
            name: collectionName, 
            staticImage,
            image,
            tracks,
            collectionType,
            subCollection,
          } = collectionItem;
          const { slug } = collectionType;
          const tracksCount = tracks.length;
          const subCollectionTeaser = subCollection && subCollection.length > 0 && subCollection.map((subCollectionItem) => {
            const {
              id: subCollectionId,
              name: subCollectionName,
              staticImage: subCollectionStaticImage,
              image: subCollectionImage,
            } = subCollectionItem;
            const subCollectionSlug = `/${subCollectionItem.collectionType.slug}/${subCollectionItem.slug}`;
            return (
              <Teaser key={subCollectionId} id={subCollectionName} slug={subCollectionSlug} title={subCollectionName} subtitle={subCollectionItem.collectionType.name} image={subCollectionImage} staticImage={subCollectionStaticImage} className="p-4 md:w-1/2 w-full" />
            );
          });
          return (
            <React.Fragment key={`t-${collectionId}`}>
              {subCollectionTeaser}
              <Teaser key={collectionId} id={collectionName} slug={`/${slug}/${slugify(collectionName)}`} title={`${collectionName} (${tracksCount})`} subtitle={collectionType.name} image={image} staticImage={staticImage} className="p-4 md:w-1/2 w-full" />
            </React.Fragment>
          )
        })}
      </div>
    </>
  ) : null
)

const Downloads = ({ gpxFileUrl, gpxFileSmallUrl }) => (
  <>
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
  </>
)

const Infos = ({ track }) => {
  const {
    startCity,
    startState,
    startCountry,
    endCity,
    endState,
    endCountry,
  } = track;

  const { 
    distance,
    totalElevationGain,
    totalElevationLoss,
    elevLow,
    elevHigh,
  } = convertMetaData(track);

  return (
    <>
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
              {totalElevationGain}
            </span>
          </div>
        </div>
        <div className="pr-4 pb-4 sm:w-1/2 w-full">
          <div className="bg-gray-800 rounded flex p-4 h-full items-center">
            <ArrowDownRight className="text-blue-500 h-8 w-8" />
            <span className="title-font font-medium text-white px-2">
              {totalElevationLoss}
            </span>
          </div>
        </div>
        <div className="pr-4 pb-4 sm:w-1/2 w-full">
          <div className="bg-gray-800 rounded flex p-4 h-full items-center">
            <ChevronUp className="text-blue-500 h-8 w-8" />
            <span className="title-font font-medium text-white px-2">
              {elevHigh}
            </span>
          </div>
        </div>
        <div className="pr-4 pb-4 sm:w-1/2 w-full">
          <div className="bg-gray-800 rounded flex p-4 h-full items-center">
            <ChevronDown className="text-blue-500 h-8 w-8" />
            <span className="title-font font-medium text-white px-2">
              {elevLow}
            </span>
          </div>
        </div>
        <div className="pr-4 pb-4 sm:w-1/2 w-full">
          <div className="bg-gray-800 rounded flex p-4 h-full items-center">
            <ArrowRight className="text-blue-500 h-8 w-8" />
            <span className="title-font font-medium text-white px-2">
              {distance}
            </span>
          </div>
        </div>
      </div>
    </>
  );       
}

const TrackPage = ({ data: { track } }) => {
  const {
    id,
    name,
    collection,
    gpxFileSmallUrl,
    gpxFileUrl,
    geoJson,
    minCoords,
    maxCoords,
    photos,
    previewImageUrl,
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
        type: 'image',
      }
    }
  });
  if (features) {
    geoJson.features.push(...features);
  }
  return (
    <Layout>
      <Seo title={name} image={previewImageUrl} />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container lg:flex lg:flex-wrap px-5 py-5 mx-auto">
          <div className="lg:w-2/3 lg:pr-6 lg:border-r lg:border-b-0 lg:mb-0 mb-10 pb-10 border-b border-gray-800">       
            <Headline title={name} />
            <QueryClientProvider client={queryClient}>
              <FeatureMap
                id={id}
                minCoords={minCoords}
                maxCoords={maxCoords}
                geoJson={geoJson}
                distance={track.distance}
              />
            </QueryClientProvider>
            <Assets assets={assets} />
            <Infos track={track} />
            <Downloads gpxFileUrl={gpxFileUrl} gpxFileSmallUrl={gpxFileSmallUrl} />
            <Collections collections={collection} />
          </div>
          <div className="lg:flex lg:flex-col lg:w-1/3 lg:pl-6">
            <QueryClientProvider client={queryClient}>
              <FeatureTeaser
                id={id}
                minCoords={minCoords} 
                maxCoords={maxCoords}
                tracks={[track]}
              />
            </QueryClientProvider>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query TrackPageQuery($name: String!) {
    track: graphCmsTrack(name: { eq: $name }) {
      id
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
        subCollection {
          id
          name
          slug
          collectionType {
            name
            slug
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
    }
  }
`

export default TrackPage
