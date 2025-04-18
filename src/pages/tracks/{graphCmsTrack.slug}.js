import React from "react"
import { graphql } from "gatsby"
import { 
  Play, Square, 
  ArrowUpRight, ArrowDownRight, ArrowRight, 
  ChevronUp, ChevronDown, Download,
  ArrowRightCircle, ArrowUpCircle, ArrowDownCircle,
} from "react-feather"
import slugify from '@sindresorhus/slugify';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "@reach/router"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Map from "../../components/mapChart"
import Header from "../../views/header"
import Headline from "../../views/headline"
import Teaser from "../../views/teaser"
import ImageSlider from "../../views/imageSlider"
import Features from "../../views/features"
import useAlgoliaFeatures from "../../hooks/useAlgoliaFeatures"
import useAlgoliaLayers from "../../hooks/useAlgoliaLayers"
import { convertMetaData } from "../../helpers/track"

const cloudinaryBaseUrl = process.env.GATSBY_CLOUDINARY_BASE_URL
const cloudinaryAppId = process.env.GATSBY_CLOUDINARY_APP_ID
const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL
const hygraphAssetBaseUrl = process.env.GATSBY_HYGRAPH_ASSET_BASE_URL
const hygraphCdnBaseUrl = process.env.GATSBY_HYGRAPH_CDN_BASE_URL
const queryClient = new QueryClient();

const teaser = ['map', 'book', 'track', 'image'];

const FeatureTeaser = ({ 
  id, minCoords, maxCoords, tracks, images,
}) => {
  const { status, data } = useAlgoliaFeatures(id, minCoords, maxCoords, teaser);
  if (status === 'success') {
    const { hits } = data;
    return teaser.map((item) => {
      const items = hits.filter((feature) => feature.type === item);
      if (items.length > 0) {
        return (
          <Features key={item} type={item} data={items} tracks={tracks} images={images} />
        );
      } else {
        return null;
      }
    });
  }
  return null;
};

const FeatureMap = ({ 
  id, minCoords, maxCoords, geoJson, distance, width, height
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
        width={width}
        height={height}
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
            collectionTypes,
            subCollection,
          } = collectionItem;
          return collectionTypes.map((collectionType) => {
            const { id: collectionTypeId, slug } = collectionType;
            const tracksCount = tracks.length;
            const subCollectionTeaser = subCollection && subCollection.length > 0 && subCollection.map((subCollectionItem) => {
              const {
                id: subCollectionId,
                name: subCollectionName,
                staticImage: subCollectionStaticImage,
                image: subCollectionImage,
                collectionTypes: subCollectionCollectionTypes,
              } = subCollectionItem;
              return subCollectionCollectionTypes.map((subCollectionCollectionType) => {
                const subCollectionSlug = `/${subCollectionCollectionType.slug}/${subCollectionItem.slug}`;
                return (
                  <Teaser key={subCollectionId} id={subCollectionName} slug={subCollectionSlug} title={subCollectionName} subtitle={subCollectionCollectionType.name} image={subCollectionImage} staticImage={subCollectionStaticImage} className="p-4 md:w-1/2 w-full" />
                );
              });
            });
            return (
              <React.Fragment key={`${collectionId}-${collectionTypeId}`}>
                {subCollectionTeaser}
                <Teaser key={collectionId} id={collectionName} slug={`/${slug}/${slugify(collectionName)}`} title={`${collectionName} (${tracksCount})`} subtitle={collectionType.name} image={image} staticImage={staticImage} className="p-4 md:w-1/2 w-full" />
              </React.Fragment>
            )
          });
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
    distance,
    totalElevationGain,
    totalElevationLoss,
    elevLow,
    elevHigh,
  } = track;

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
    title,
    description,
    collection,
    downloadGpx,
    geoJson,
    minCoords,
    maxCoords,
    photos,
    images,
    previewImageUrl,
    startCity,
    startState,
    startCountry,
    endCity,
    endState,
    endCountry,
  } = track
  const gpxFileSmallUrl = track.gpxFileSmallUrl?.replace(assetBaseUrl, hygraphCdnBaseUrl);
  const gpxFileUrl = track.gpxFileUrl?.replace(assetBaseUrl, hygraphCdnBaseUrl);

  const assets = [];
  if(photos.length > 0) {
    photos.forEach(photo => {
      const { id, handle, fileName, location, width, height } = photo;
      const { latitude, longitude } = location;
      const orientation = width > height ? 'landscape' : 'portrait';
      assets.push({
        key: id,
        id: handle,
        src: `${hygraphAssetBaseUrl}/resize=h:320,fit:crop/auto_image/compress=metadata:true/${handle}`,
        title: fileName,
        orientation,
        latitude,
        longitude,
        width,
        height,
      });
    })
  } else if (images.length > 0) {
    images.forEach(image => {
      const { asset_id: id, public_id, width, height, context: { custom: { lat: latitude, lon: longitude } } } = image;
      const orientation = width > height ? 'landscape' : 'portrait';
      assets.push({
        key: id,
        id: public_id,
        src: `${cloudinaryBaseUrl}/c_fit,h_320/q_auto/f_auto/${cloudinaryAppId}/${public_id}`,
        title: public_id,
        orientation,
        latitude,
        longitude,
        width,
        height,
      });
    });
  }
  const features = assets.map((asset) => {
    const { latitude, longitude, title, width, height, orientation, src } = asset;
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
        fileName: title,
        src,
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

  const { 
    distance,
    totalElevationGain,
    totalElevationLoss,
    elevLow,
    elevHigh,
  } = convertMetaData(track);

  const trackInfo = {
    startCity,
    startState,
    startCountry,
    endCity,
    endState,
    endCountry,
    distance,
    totalElevationGain,
    totalElevationLoss,
    elevLow,
    elevHigh,
  };

  const location = useLocation();
  const { hash } = location;
  if (hash && hash === '#map') {
    return (
      <QueryClientProvider client={queryClient}>
        <FeatureMap
          id={id}
          minCoords={minCoords}
          maxCoords={maxCoords}
          geoJson={geoJson}
          distance={track.distance}
          width="100%"
          height="70vH"
        />
      </QueryClientProvider>
    );
  }
  return (
    <Layout>
      <Seo title={title} image={previewImageUrl} noIndex={track.private} />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container lg:flex lg:flex-wrap px-5 py-5 mx-auto">
          <div className="lg:w-2/3 lg:pr-6 lg:border-r lg:border-b-0 lg:mb-0 mb-10 pb-10 border-b border-gray-800">       
            <Header title={title} description={description} />
            <div className="flex mb-4 -mt-4">
              <span className="text-gray-500 inline-flex items-center lg:mr-2 md:mr-0 mr-2 leading-none py-1">
                <ArrowRightCircle className="w-4 h-4 mr-1" />
                {distance}
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-2 md:mr-0 mr-2 leading-none py-1">
                <ArrowUpCircle className="w-4 h-4 mr-1" />
                {totalElevationGain}
              </span>
              <span className="text-gray-500 inline-flex items-center lg:mr-2 md:mr-0 mr-2 leading-none py-1">
                <ArrowDownCircle className="w-4 h-4 mr-1" />
                {totalElevationLoss}
              </span>
            </div>
            <QueryClientProvider client={queryClient}>
              <FeatureMap
                id={id}
                minCoords={minCoords}
                maxCoords={maxCoords}
                geoJson={geoJson}
                distance={track.distance}
                width="100%"
                height="50vH"
              />
            </QueryClientProvider>
            <Assets assets={assets} />
            <Infos track={trackInfo} />
            { downloadGpx === false ? null : <Downloads gpxFileUrl={gpxFileUrl} gpxFileSmallUrl={gpxFileSmallUrl} /> }
            <Collections collections={collection} />
          </div>
          <div className="lg:flex lg:flex-col lg:w-1/3 lg:pl-6">
            <QueryClientProvider client={queryClient}>
              <FeatureTeaser
                id={id}
                minCoords={minCoords} 
                maxCoords={maxCoords}
                tracks={[track]}
                images={assets}
              />
            </QueryClientProvider>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const pageQuery = graphql`
  query TrackPageQuery($slug: String!) {
    track: graphCmsTrack(slug: { eq: $slug }) {
      id
      name
      description {
        markdown
        html
      }
      title
      slug
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
        collectionTypes {
          id
          name
          slug
        }
        subCollection {
          id
          name
          slug
          collectionTypes {
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
      downloadGpx
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
      images
      private
    }
  }
`

export default TrackPage
