import * as React from "react"
import slugify from '@sindresorhus/slugify';
import { QueryClient, QueryClientProvider } from "react-query";
import { Tab } from '@headlessui/react'
import { Grid, Map, Menu } from 'react-feather';
import { useLocation } from "@reach/router"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Mapbox from "../components/mapbox/collection"
import Header from "../views/header"
import Headline from "../views/headline"
import Tracks from "../views/tracks"
import Teaser from "../views/teaser"
import TrackTable from "../views/trackTable"
import Features from "../views/features"
import useAlgoliaFeatures from "../hooks/useAlgoliaFeatures"
import useAlgoliaLayers from "../hooks/useAlgoliaLayers"

const assetBaseUrl = process.env.GATSBY_ASSET_BASE_URL
const queryClient = new QueryClient();

const FeatureTeaser = ({ 
  id, minCoords, maxCoords, tracks, teaser,
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
  id, geoJson, minCoords, maxCoords, tracksCount, colorScheme, width, height,
}) => {
  const { status, data } = useAlgoliaLayers(id, minCoords, maxCoords);
  if (status === 'success') {
    const { facets } = data;
    const layers = Object.keys(facets.type);
    return (
      <Mapbox
        id={id}
        data={geoJson}
        minCoords={minCoords}
        maxCoords={maxCoords}
        layers={layers}
        tracksCount={tracksCount}
        colorScheme={colorScheme}
        width={width}
        height={height}
      />
    );
  }
  return null;
};

const CollectionsListTemplate = (props) => {
  const { pageContext } = props
  const { 
    id, name, description, tracks, geoJson, minCoords, maxCoords, 
    staticImage, subCollections, privateCollection, collectionType,
  } = pageContext;
  const { colorScheme, teaser, name: collectionTypeName, slug: collectionTypeSlug } = collectionType;
  geoJson.features.map((geoJsonFeature) => {
    const { geometry, properties } = geoJsonFeature;
    const { type, coordinates } = geometry;
    if (type === 'LineString') {
      const index = Math.round(coordinates.length / 2);
      const trackPoint = {
        type: "Point",
        coordinates: coordinates[index],
      };
      const trackPointFeature = {
        type: 'Feature',
        properties: {
          ...properties,
          type: 'trackPoint',
        },
        geometry: trackPoint,
      };
      geoJson.features.push(trackPointFeature);
    }
    return geoJsonFeature;
  });
  const staticImageUrl = staticImage ? `${assetBaseUrl}/${staticImage.handle}` : '';
  const buttonClass = 'relative inline-flex items-center px-2 py-2 border-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-800';
  const tracksCount = tracks.length;
  const headline = tracksCount > 0 ? 'Touren' : 'Sammlungen';
  const width = tracksCount > 0 ? 'lg:w-2/3' : 'w-full';
  const additionLink = {
    to: `/${collectionTypeSlug}`,
    title: collectionTypeName,
  };

  const location = useLocation();
  const { hash } = location;
  if (hash && hash === '#map') {
    return (
      subCollections.length > 0 ? (
        <Mapbox
          id={id}
          data={geoJson}
          minCoords={minCoords}
          maxCoords={maxCoords}
          subCollections={subCollections}
          tracksCount={tracksCount}
          colorScheme={colorScheme}
          width="100%"
          height="100vH"
        />
      ) : (
        <QueryClientProvider client={queryClient}>
          <FeatureMap
            id={id}
            geoJson={geoJson}
            minCoords={minCoords}
            maxCoords={maxCoords}
            tracksCount={tracksCount}
            colorScheme={colorScheme}
            width="100%"
            height="100vH"
          />
        </QueryClientProvider>
      )
    )
  }
  return (
    <Layout>
      <Seo title={name} image={staticImageUrl} noIndex={privateCollection} />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container lg:flex lg:flex-wrap px-5 py-5 mx-auto">
          <div className={`${width} lg:pr-6 lg:border-r lg:border-b-0 lg:mb-0 mb-10 pb-10 border-b border-gray-800`}>
            {geoJson && minCoords && maxCoords ? (
              <>
                <Header title={name} description={description} additionalLink={additionLink} />
                <Tab.Group>
                  <div className="flex justify-between">
                    <Headline title={headline} />
                    <Tab.List>
                      <Tab
                        className={({ selected }) =>
                          selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                        }
                      >
                        <Map className="h-5 w-5" />
                      </Tab>                        
                      <Tab
                        className={({ selected }) =>
                          selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                        }
                      >
                        <Grid className="h-5 w-5" />
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          selected ? `bg-gray-800 ${buttonClass}` : `border ${buttonClass}`
                        }
                      >
                        <Menu className="h-5 w-5" />
                      </Tab>
                    </Tab.List>
                  </div>
                  <Tab.Panels>
                    <Tab.Panel>
                      <div className="mb-10 w-full">
                        {subCollections.length > 0 ? (
                          <Mapbox
                            id={id}
                            data={geoJson}
                            minCoords={minCoords}
                            maxCoords={maxCoords}
                            subCollections={subCollections}
                            tracksCount={tracksCount}
                            colorScheme={colorScheme}
                            width="100%"
                            height="50vH"
                          />
                        ) : (
                          <QueryClientProvider client={queryClient}>
                            <FeatureMap
                              id={id}
                              geoJson={geoJson}
                              minCoords={minCoords}
                              maxCoords={maxCoords}
                              tracksCount={tracksCount}
                              colorScheme={colorScheme}
                              width="100%"
                              height="50vH"
                            />
                          </QueryClientProvider>
                        )}
                      </div>
                    </Tab.Panel>
                    <Tab.Panel>
                      {tracksCount > 0 ? (
                        <Tracks tracks={tracks} className="p-4 lg:w-1/2" />
                      ) : (
                        subCollections.length > 0 ? (
                          <div className="flex flex-wrap -m-4 mb-10">
                            {subCollections.map(collectionItem => {
                              const { 
                                id: collectionId, 
                                name: collectionName, 
                                staticImage,
                                image,
                                tracks,
                              } = collectionItem;
                              const { slug } = collectionItem.collectionType;
                              const tracksCount = tracks.length;
                              return <Teaser key={collectionId} id={collectionName} slug={`/${slug}/${slugify(collectionName)}`} title={`${collectionName} (${tracksCount})`} image={image} staticImage={staticImage} className="p-4 md:w-1/3 w-full" />
                            })}
                          </div>
                        ) : null
                      )}
                    </Tab.Panel>
                    <Tab.Panel>
                      <TrackTable tracks={tracks} subCollections={subCollections} />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>               
              </>
            ) :
              <Tracks name={name} description={description} tracks={tracks} className="p-4 lg:w-1/2" />
            }
          </div>
          {tracksCount > 0 ? (
            <div className="lg:flex lg:flex-col lg:w-1/3 lg:pl-6">
              <QueryClientProvider client={queryClient}>
                <FeatureTeaser
                  id={id}
                  minCoords={minCoords}
                  maxCoords={maxCoords}
                  tracks={tracks}
                  teaser={teaser}
                />
              </QueryClientProvider>
            </div>
          ) : null}
        </div>
      </section>
    </Layout>
  )
}

export default CollectionsListTemplate;
