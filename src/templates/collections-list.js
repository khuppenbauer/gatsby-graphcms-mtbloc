import * as React from "react"
import slugify from '@sindresorhus/slugify';
import { QueryClient, QueryClientProvider } from "react-query";


import Layout from "../components/layout"
import Seo from "../components/seo"
import Mapbox from "../components/mapbox/collection"
import Headline from "../views/headline"
import Tracks from "../views/tracks"
import Teaser from "../views/teaser"
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
  id, geoJson, minCoords, maxCoords,
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
      />
    );
  }
  return null;
};

const CollectionsListTemplate = (props) => {
  const { pageContext } = props
  const { 
    id, name, description, tracks, geoJson, minCoords, maxCoords, 
    staticImage, subCollections, teaser, 
  } = pageContext;
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
  return (
    <Layout>
      <Seo title={name} image={staticImageUrl} />
      <section className="text-gray-400 bg-gray-900 body-font">
        <div className="container lg:flex lg:flex-wrap px-5 py-5 mx-auto">
          <div className="lg:w-2/3 lg:pr-6 lg:border-r lg:border-b-0 lg:mb-0 mb-10 pb-10 border-b border-gray-800">
            {geoJson && minCoords && maxCoords ? (
              <>
                <Headline title={name} description={description} />
                <div className="mb-10 w-full">
                  {subCollections.length > 0 ? (
                    <Mapbox
                      id={id}
                      data={geoJson}
                      minCoords={minCoords}
                      maxCoords={maxCoords}
                      subCollections={subCollections}
                    />
                  ) : (
                    <QueryClientProvider client={queryClient}>
                      <FeatureMap
                        id={id}
                        geoJson={geoJson}
                        minCoords={minCoords}
                        maxCoords={maxCoords}
                      />
                    </QueryClientProvider>
                  )}
                </div>
                {tracks.length > 0 ? (
                  <Tracks name="Touren" tracks={tracks} className="p-4 lg:w-1/2" />
                ) : (
                  subCollections.length > 0 ? (
                    <>
                      <Headline title="Sammlungen" />
                      <div className="flex flex-wrap -m-4 mb-10">
                        {subCollections.map(collectionItem => {
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
                          return <Teaser key={collectionId} id={collectionName} slug={`/${slug}/${slugify(collectionName)}`} title={`${collectionName} (${tracksCount})`} image={image} staticImage={staticImage} className="p-4 md:w-1/2 w-full" />
                        })}
                      </div>
                    </>
                  ) : null
                )}
              </>
            ) :
              <Tracks name={name} description={description} tracks={tracks} className="p-4 lg:w-1/2" />
            }
          </div>
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
        </div>
      </section>
    </Layout>
  )
}

export default CollectionsListTemplate;
